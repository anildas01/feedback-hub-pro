/**
 * MongoDB API Client (frontend)
 * Calls our local Express server at /api — the server handles MongoDB directly.
 * Credentials stay server-side and are never exposed to the browser.
 */

import { AdminSession, ADMIN_SESSION_KEY } from "./types";

const API_BASE = import.meta.env.DEV ? "http://localhost:3001/api" : "/api";

const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    try {
        const raw = localStorage.getItem(ADMIN_SESSION_KEY);
        if (raw) {
            const session: AdminSession = JSON.parse(raw);
            if (session.token) {
                headers.Authorization = `Bearer ${session.token}`;
            }
        }
    } catch { /* ignore parse error */ }
    return headers;
};

/** Insert a document via the Express API */
export async function insertOne(
    collection: "feedback_submissions" | "prompt_submissions",
    document: Record<string, unknown>
): Promise<{ insertedId: string }> {
    const endpoint = collection === "feedback_submissions" ? "/feedback" : "/prompts";
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(document),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Insert failed: ${res.status}`);
    }
    return res.json();
}

/** Fetch all documents from a collection via the Express API */
export async function find<T = Record<string, unknown>>(
    collection: "feedback_submissions" | "prompt_submissions"
): Promise<T[]> {
    const endpoint = collection === "feedback_submissions" ? "/feedback" : "/prompts";
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Fetch failed: ${res.status}`);
    }
    return res.json();
}

/** Hit Express API to login and receive a JWT */
export async function login(email: string, password: string): Promise<AdminSession> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Login failed`);
    }
    const data = await res.json();
    return {
        loggedIn: true,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
    };
}

export async function createUser(email: string, password: string): Promise<{ success: boolean; insertedId: string }> {
    const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Failed to create user`);
    }
    return res.json();
}

export async function fetchUsers(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/users`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Failed to fetch users`);
    }
    return res.json();
}
