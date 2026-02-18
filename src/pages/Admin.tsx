import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLogin } from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  Users,
  Star,
  BarChart3,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  q1_rating: number;
  q2_rating: number;
  q3_rating: number;
  q4_rating: number;
  overall_rating: number;
  comments: string | null;
  created_at: string;
}

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= rating ? "text-star" : "text-star-empty"}>★</span>
    ))}
    <span className="ml-1 text-xs text-muted-foreground">({rating}/5)</span>
  </div>
);

const avgRating = (submissions: Submission[], key: keyof Submission) => {
  if (!submissions.length) return 0;
  const sum = submissions.reduce((acc, s) => acc + (s[key] as number), 0);
  return (sum / submissions.length).toFixed(1);
};

export default function Admin() {
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [fetching, setFetching] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (session) fetchSubmissions();
  }, [session]);

  const fetchSubmissions = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("feedback_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load submissions", variant: "destructive" });
    } else {
      setSubmissions(data || []);
    }
    setFetching(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <AdminLogin onLogin={() => {}} />;

  const ratingLabels = [
    { key: "q1_rating" as const, label: "Web Development Content" },
    { key: "q2_rating" as const, label: "Career Opportunities" },
    { key: "q3_rating" as const, label: "Skills Discussion" },
    { key: "q4_rating" as const, label: "Getting Started Guidance" },
    { key: "overall_rating" as const, label: "Overall Rating" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="gradient-hero text-primary-foreground px-4 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg">Behind Every App — Admin</h1>
            <p className="text-primary-foreground/70 text-xs">Feedback Dashboard · Profenger Learning</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}
            className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="col-span-2 sm:col-span-1 lg:col-span-2 bg-card rounded-xl border border-border p-4 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{submissions.length}</p>
              <p className="text-xs text-muted-foreground">Total Responses</p>
            </div>
          </div>
          {ratingLabels.slice(0, 4).map(({ key, label }) => (
            <div key={key} className="bg-card rounded-xl border border-border p-4 shadow-card">
              <p className="text-xl font-bold text-foreground">{avgRating(submissions, key)}</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={s <= Math.round(Number(avgRating(submissions, key))) ? "text-star text-xs" : "text-star-empty text-xs"}>★</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{label}</p>
            </div>
          ))}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-xl font-bold text-primary">{avgRating(submissions, "overall_rating")}</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= Math.round(Number(avgRating(submissions, "overall_rating"))) ? "text-star text-xs" : "text-star-empty text-xs"}>★</span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Overall Avg.</p>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="px-4 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              All Submissions
            </h2>
            <button onClick={fetchSubmissions} className="text-xs text-primary hover:underline">
              Refresh
            </button>
          </div>

          {fetching ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No submissions yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {submissions.map((sub, i) => (
                <div key={sub.id} className="hover:bg-secondary/30 transition-colors">
                  {/* Row Summary */}
                  <button
                    className="w-full px-4 py-4 text-left"
                    onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground text-xs font-bold">
                          {sub.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{sub.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{sub.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="hidden sm:flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-star fill-star" />
                          <span className="text-sm font-medium">{sub.overall_rating}/5</span>
                        </div>
                        <span className="text-xs text-muted-foreground hidden md:block">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                        {expandedId === sub.id ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedId === sub.id && (
                    <div className="px-4 pb-4 bg-secondary/20">
                      <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</p>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3.5 h-3.5 text-primary" />
                            <span>{sub.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3.5 h-3.5 text-primary" />
                            <span>{sub.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>{new Date(sub.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ratings</p>
                          {ratingLabels.map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between text-xs gap-2">
                              <span className="text-muted-foreground truncate">{label}</span>
                              <StarDisplay rating={sub[key]} />
                            </div>
                          ))}
                        </div>
                      </div>
                      {sub.comments && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Comments</p>
                          <p className="text-sm text-foreground/80 bg-background rounded-lg p-3 border border-border">
                            {sub.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
