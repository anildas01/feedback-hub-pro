/**
 * MongoDB API Client (frontend)
 * Calls our local Express server at /api — the server handles MongoDB directly.
 * Credentials stay server-side and are never exposed to the browser.
 */

const API_BASE = "http://localhost:3001/api";

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
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Fetch failed: ${res.status}`);
    }
    return res.json();
}
