import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("❌ MONGODB_URI is not set in .env");
    process.exit(1);
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db(process.env.MONGODB_DATABASE || "feedback_hub");
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ─── Feedback Submissions ──────────────────────────────────────
app.post("/api/feedback", async (req, res) => {
    try {
        const doc = { ...req.body, created_at: new Date().toISOString() };
        const result = await db.collection("feedback_submissions").insertOne(doc);
        res.json({ insertedId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/feedback", async (_req, res) => {
    try {
        const docs = await db
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
        const result = await db.collection("prompt_submissions").insertOne(doc);
        res.json({ insertedId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/prompts", async (_req, res) => {
    try {
        const docs = await db
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
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 API server running at http://localhost:${PORT}`);
    });
});
