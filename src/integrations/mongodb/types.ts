/** MongoDB document base (Atlas uses _id as ObjectId string) */
export interface MongoDocument {
    _id?: string;
    created_at: string;
}

export interface FeedbackSubmission extends MongoDocument {
    name: string;
    email: string | null;
    phone: string;
    q1_rating: number | null;
    q2_rating: number | null;
    q3_rating: number | null;
    q4_rating: number | null;
    overall_rating: number | null;
    comments: string | null;
}

export interface PromptSubmission extends MongoDocument {
    name: string;
    email: string;
    phone: string;
    prompt: string;
}

export interface AdminSession {
    loggedIn: boolean;
    email: string;
}

export const ADMIN_SESSION_KEY = "admin_session";
