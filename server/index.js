import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_for_dev_mode";

let client;

let db;
let isConnecting = false;

async function getDB() {
    if (db) return db;
    if (isConnecting) {
        // Wait briefly if connection is already in progress
        await new Promise(resolve => setTimeout(resolve, 500));
        return db;
    }

    isConnecting = true;
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not set in environment variables.");
        }

        if (!client) {
            client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
            });
        }

        await client.connect();
        db = client.db(process.env.MONGODB_DATABASE || "feedback_hub");
        console.log("✅ Connected to MongoDB Atlas");

        // Seed default superAdmin
        const adminEmail = process.env.VITE_ADMIN_EMAIL?.trim()?.toLowerCase();
        const adminPass = process.env.VITE_ADMIN_PASSWORD;
        if (adminEmail && adminPass) {
            const existing = await db.collection("users").findOne({ email: adminEmail });
            if (!existing) {
                const hashedPassword = await bcrypt.hash(adminPass, 10);
                await db.collection("users").insertOne({
                    email: adminEmail,
                    password: hashedPassword,
                    role: "superAdmin",
                    created_at: new Date().toISOString()
                });
                console.log("✅ Seeded default superAdmin user from .env");
            }
        }
        isConnecting = false;
        return db;
    } catch (err) {
        isConnecting = false;
        console.error("❌ MongoDB connection failed:", err.message);
        throw err;
    }
}

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());

// Guarantee DB Connection for every request (Serverless friendly)
app.use(async (req, res, next) => {
    try {
        req.db = await getDB();
        next();
    } catch (err) {
        res.status(500).json({ error: "Database connection failed" });
    }
});

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing Token" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
};

const requireSuperAdmin = (req, res, next) => {
    if (req.user?.role !== "superAdmin") {
        return res.status(403).json({ error: "Forbidden: Requires superAdmin role" });
    }
    next();
};

// ─── Health Check ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ─── Auth & Users ──────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim()?.toLowerCase();
        const user = await req.db.collection("users").findOne({ email: normalizedEmail });

        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ token, user: { email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/users", requireAuth, requireSuperAdmin, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });

        const normalizedEmail = email.trim().toLowerCase();
        const existing = await req.db.collection("users").findOne({ email: normalizedEmail });
        if (existing) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await req.db.collection("users").insertOne({
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin", // Default to admin, only superAdmin creates users
            created_at: new Date().toISOString()
        });
        res.json({ success: true, insertedId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/users", requireAuth, requireSuperAdmin, async (req, res) => {
    try {
        const users = await req.db.collection("users")
            .find({}, { projection: { password: 0 } })
            .sort({ created_at: -1 })
            .toArray();
        res.json(users.map(u => ({ ...u, _id: u._id.toString() })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Feedback Submissions ──────────────────────────────────────
app.post("/api/feedback", async (req, res) => {
    try {
        const doc = { ...req.body, created_at: new Date().toISOString() };
        const result = await req.db.collection("feedback_submissions").insertOne(doc);
        res.json({ insertedId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/feedback", requireAuth, async (req, res) => {
    try {
        const docs = await req.db
            .collection("feedback_submissions")
            .find({})
            .sort({ created_at: -1 })
            .limit(500)
            .toArray();
        // Convert ObjectId to string
        const data = docs.map((d) => ({ ...d, _id: d._id.toString() }));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Prompt Submissions ────────────────────────────────────────
app.post("/api/prompts", async (req, res) => {
    try {
        const doc = { ...req.body, created_at: new Date().toISOString() };
        const result = await req.db.collection("prompt_submissions").insertOne(doc);
        res.json({ insertedId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/prompts", requireAuth, async (req, res) => {
    try {
        const docs = await req.db
            .collection("prompt_submissions")
            .find({})
            .sort({ created_at: -1 })
            .limit(500)
            .toArray();
        const data = docs.map((d) => ({ ...d, _id: d._id.toString() }));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Start ─────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`🚀 API server running at http://localhost:${PORT}`);
    });
}

export default app;
