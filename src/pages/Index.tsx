import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { ThankYou } from "@/components/ThankYou";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookOpen, Briefcase, Lightbulb, Rocket, MessageSquare } from "lucide-react";
import eventPoster from "@/assets/event-poster.jfif";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,15}$/, "Please enter a valid phone number"),
  comments: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

const questions = [
  { key: "q1_rating" as const, label: "How would you rate the session content (What is Web Development)?", icon: BookOpen },
  { key: "q2_rating" as const, label: "How useful was the Career Opportunities segment?", icon: Briefcase },
  { key: "q3_rating" as const, label: "How would you rate the 'Skills You Need' discussion?", icon: Lightbulb },
  { key: "q4_rating" as const, label: "How helpful was the 'How to Get Started' guidance?", icon: Rocket },
];

const Index = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ratings, setRatings] = useState({
    q1_rating: 0,
    q2_rating: 0,
    q3_rating: 0,
    q4_rating: 0,
    overall_rating: 0,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const updateRating = (key: keyof typeof ratings) => (value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (data: FormData) => {
    if (Object.values(ratings).some((r) => r === 0)) {
      toast({ title: "Please rate all questions before submitting.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("feedback_submissions").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        comments: data.comments || null,
        ...ratings,
      });
      if (error) throw error;
      setSubmittedName(data.name.split(" ")[0]);
      setSubmitted(true);
    } catch (err) {
      toast({ title: "Failed to submit. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmittedName("");
    setRatings({ q1_rating: 0, q2_rating: 0, q3_rating: 0, q4_rating: 0, overall_rating: 0 });
    reset();
  };

  if (submitted) return <ThankYou name={submittedName} onReset={handleReset} />;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="gradient-hero text-primary-foreground py-8 px-4">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <img
            src={eventPoster}
            alt="Behind Every App - Career Awareness Session"
            className="w-32 h-40 object-cover rounded-xl shadow-lg flex-shrink-0"
          />
          <div className="text-center sm:text-left">
            <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-widest mb-1">
              Career Awareness Session
            </p>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 leading-tight">
              Behind Every App
            </h1>
            <p className="text-primary-foreground/80 text-sm mb-1">
              Department of Commerce · NSS College Manjeri
            </p>
            <p className="text-primary-foreground/70 text-xs">
              18/02/2026 · 02:30 PM · Organized by Profenger Learning
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">Share Your Feedback</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your honest feedback helps us improve future sessions. All fields are required.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider border-b border-border pb-2">
                Personal Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    {...register("name")}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+91 XXXXX XXXXX"
                    {...register("phone")}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
              </div>
            </div>

            {/* Session Ratings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider border-b border-border pb-2">
                Session Ratings
              </h3>
              {questions.map(({ key, label, icon: Icon }) => (
                <div key={key} className="bg-secondary/40 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <StarRating
                      value={ratings[key]}
                      onChange={updateRating(key)}
                      label={label}
                    />
                  </div>
                </div>
              ))}

              {/* Overall Rating */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">★</span>
                  </div>
                  <StarRating
                    value={ratings.overall_rating}
                    onChange={updateRating("overall_rating")}
                    label="Overall, how would you rate this Career Awareness Session?"
                  />
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider border-b border-border pb-2">
                Additional Comments
              </h3>
              <div className="flex items-start gap-3 bg-secondary/40 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="comments">Your thoughts, suggestions, or feedback</Label>
                  <Textarea
                    id="comments"
                    placeholder="Share anything you'd like — what you enjoyed, what could be improved, topics you'd like covered in future sessions..."
                    rows={4}
                    {...register("comments")}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 text-base font-semibold shadow-btn"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Powered by <span className="font-semibold text-primary">Profenger Learning</span> · learning.profenger.com
        </p>
      </div>
    </div>
  );
};

export default Index;
