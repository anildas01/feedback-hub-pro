import { useEffect, useState } from "react";
import { find, createUser, fetchUsers } from "@/integrations/mongodb/client";
import { ADMIN_SESSION_KEY, type FeedbackSubmission, type PromptSubmission, type User } from "@/integrations/mongodb/types";
import { AdminLogin } from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
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
  Lightbulb,
  Download,
} from "lucide-react";

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= rating ? "text-star" : "text-star-empty"}>★</span>
    ))}
    <span className="ml-1 text-xs text-muted-foreground">({rating}/5)</span>
  </div>
);

const avgRating = (submissions: FeedbackSubmission[], key: keyof FeedbackSubmission) => {
  if (!submissions.length) return 0;
  const sum = submissions.reduce((acc, s) => acc + ((s[key] as number) || 0), 0);
  return (sum / submissions.length).toFixed(1);
};

export default function Admin() {
  const { toast } = useToast();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>("admin");
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);
  const [prompts, setPrompts] = useState<PromptSubmission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"feedback" | "prompts" | "users">("feedback");

  // Check localStorage for existing session
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session?.loggedIn) {
          setLoggedIn(true);
          if (session.role) setUserRole(session.role);
        }
      }
    } catch {
      // ignore corrupt session
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      if (activeTab === "feedback") fetchSubmissions();
      else if (activeTab === "prompts") fetchPrompts();
      else if (activeTab === "users" && userRole === "superAdmin") loadUsers();
    }
  }, [loggedIn, activeTab, userRole]);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch {
      toast({ title: "Failed to load users", variant: "destructive" });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      await createUser(newEmail, newPassword);
      toast({ title: "User created successfully" });
      setNewEmail("");
      setNewPassword("");
      loadUsers();
    } catch (err: any) {
      toast({ title: "Failed to create user", description: err.message, variant: "destructive" });
    } finally {
      setCreatingUser(false);
    }
  };

  const exportToPDF = (type: "feedback" | "prompts") => {
    const doc = new jsPDF();
    if (type === "feedback") {
      doc.text("Feedback Submissions", 14, 15);
      const tableData = submissions.map(s => [s.name, s.email || "-", s.phone, s.overall_rating ? s.overall_rating.toString() : "-", s.comments || "-"]);
      autoTable(doc, { head: [['Name', 'Email', 'Phone', 'Rating', 'Comments']], body: tableData, startY: 20 });
      doc.save("feedback_submissions.pdf");
    } else {
      doc.text("Prompt Submissions", 14, 15);
      const tableData = prompts.map(s => [s.name, s.email || "-", s.phone, s.prompt]);
      autoTable(doc, { head: [['Name', 'Email', 'Phone', 'Prompt']], body: tableData, startY: 20 });
      doc.save("prompt_submissions.pdf");
    }
  };

  const exportToExcel = (type: "feedback" | "prompts") => {
    if (type === "feedback") {
      const ws = XLSX.utils.json_to_sheet(submissions);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Feedback");
      XLSX.writeFile(wb, "feedback_submissions.xlsx");
    } else {
      const ws = XLSX.utils.json_to_sheet(prompts);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Prompts");
      XLSX.writeFile(wb, "prompt_submissions.xlsx");
    }
  };

  const fetchSubmissions = async () => {
    setFetching(true);
    try {
      const data = await find<FeedbackSubmission>("feedback_submissions");
      setSubmissions(data);
    } catch {
      toast({ title: "Failed to load submissions", variant: "destructive" });
    }
    setFetching(false);
  };

  const fetchPrompts = async () => {
    setFetching(true);
    try {
      const data = await find<PromptSubmission>("prompt_submissions");
      setPrompts(data);
    } catch {
      toast({ title: "Failed to load prompts", variant: "destructive" });
    }
    setFetching(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setLoggedIn(false);
    setSubmissions([]);
    setPrompts([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <AdminLogin
        onLogin={(role) => {
          setUserRole(role);
          setLoggedIn(true);
          // Manually trigger the first fetch right after login to avoid empty state
          if (activeTab === "feedback") fetchSubmissions();
          else if (activeTab === "prompts") fetchPrompts();
          else if (activeTab === "users" && role === "superAdmin") loadUsers();
        }}
      />
    );
  }

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
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-border pb-1">
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "feedback"
              ? "bg-card border-x border-t border-border text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Feedback
          </button>
          <button
            onClick={() => setActiveTab("prompts")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "prompts"
              ? "bg-card border-x border-t border-border text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Prompt Contest
          </button>
          {userRole === "superAdmin" && (
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "users"
                ? "bg-card border-x border-t border-border text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Users
            </button>
          )}
        </div>

        {activeTab === "feedback" && (
          <>
            {/* Feedback Stats Cards */}
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
                <div className="flex items-center gap-3">
                  <button onClick={fetchSubmissions} className="text-xs text-primary hover:underline">
                    Refresh
                  </button>
                  {userRole === "superAdmin" && (
                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                      <Button variant="outline" size="sm" onClick={() => exportToPDF("feedback")} className="h-7 text-xs px-2">
                        <Download className="w-3 h-3 mr-1" /> PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportToExcel("feedback")} className="h-7 text-xs px-2">
                        <Download className="w-3 h-3 mr-1" /> Excel
                      </Button>
                    </div>
                  )}
                </div>
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
                  {submissions.map((sub) => (
                    <div key={sub._id} className="hover:bg-secondary/30 transition-colors">
                      <button
                        className="w-full px-4 py-4 text-left"
                        onClick={() => setExpandedId(expandedId === sub._id ? null : sub._id!)}
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
                            {expandedId === sub._id ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </button>

                      {expandedId === sub._id && (
                        <div className="px-4 pb-4 bg-secondary/20">
                          <div className="grid sm:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</p>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3.5 h-3.5 text-primary" />
                                <span>{sub.email || "—"}</span>
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
                                  <StarDisplay rating={sub[key] as number} />
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
          </>
        )}

        {activeTab === "prompts" && (
          /* Prompt Submissions Tab */
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="px-4 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Prompt Contest Entries ({prompts.length})
              </h2>
              <div className="flex items-center gap-3">
                <button onClick={fetchPrompts} className="text-xs text-primary hover:underline">
                  Refresh
                </button>
                {userRole === "superAdmin" && (
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                    <Button variant="outline" size="sm" onClick={() => exportToPDF("prompts")} className="h-7 text-xs px-2">
                      <Download className="w-3 h-3 mr-1" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportToExcel("prompts")} className="h-7 text-xs px-2">
                      <Download className="w-3 h-3 mr-1" /> Excel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {fetching ? (
              <div className="py-16 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : prompts.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Lightbulb className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No prompt submissions yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {prompts.map((sub) => (
                  <div key={sub._id} className="hover:bg-secondary/30 transition-colors">
                    <button
                      className="w-full px-4 py-4 text-left"
                      onClick={() => setExpandedId(expandedId === sub._id ? null : sub._id!)}
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
                          <span className="text-xs text-muted-foreground hidden md:block">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </span>
                          {expandedId === sub._id ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </button>

                    {expandedId === sub._id && (
                      <div className="px-4 pb-4 bg-secondary/20">
                        <div className="grid sm:grid-cols-2 gap-4 pt-2 mb-3">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Details</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3.5 h-3.5 text-primary" />
                              <span>{sub.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-3.5 h-3.5 text-primary" />
                              <span>{new Date(sub.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Prompt Submission</p>
                          <div className="text-sm text-foreground/80 bg-background rounded-lg p-4 border border-border whitespace-pre-wrap font-mono">
                            {sub.prompt}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && userRole === "superAdmin" && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden p-6 max-w-xl">
              <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Create Admin User
              </h2>
              <p className="text-muted-foreground text-sm mb-6">Create additional admin accounts. New users will have standard "admin" privileges (they cannot export data or create users).</p>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Identifier / Name</Label>
                  <Input type="text" placeholder="Minimum 6 characters" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required minLength={6} />
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input type="password" placeholder="Minimum 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" disabled={creatingUser} className="w-full">
                  {creatingUser ? "Creating..." : "Create User"}
                </Button>
              </form>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="px-4 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Admin Directory</h2>
                <div className="text-sm text-muted-foreground">{users.length} total user(s)</div>
              </div>
              <div className="divide-y divide-border">
                {users.map(u => (
                  <div key={u._id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-medium text-foreground">{u.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${u.role === "superAdmin" ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                          {u.role}
                        </span>
                        <span className="text-xs text-muted-foreground">Joined {new Date(u.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {users.length === 0 && !fetching && (
                  <div className="py-8 text-center text-muted-foreground">No users found.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
