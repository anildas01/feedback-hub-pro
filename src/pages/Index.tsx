import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertOne } from "@/integrations/mongodb/client";
import { ThankYou } from "@/components/ThankYou";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().trim().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
  comments: z.string().trim().min(5, "Please share your thoughts (at least 5 characters)").max(1000),
  overall_rating: z.number().min(1, "Please provide an overall rating"),
});

type FormData = z.infer<typeof schema>;

const Index = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      overall_rating: 0
    }
  });

  const overallRating = watch("overall_rating");

  const onSubmit = async (data: FormData) => {
    if (data.overall_rating === 0) {
      toast({ title: "Please provide an overall rating.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      await insertOne("feedback_submissions", {
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        comments: data.comments,
        overall_rating: data.overall_rating,
        q1_rating: null,
        q2_rating: null,
        q3_rating: null,
        q4_rating: null,
        created_at: new Date().toISOString(),
      });
      setSubmittedName(data.name.split(" ")[0]);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      toast({ title: "Failed to submit. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmittedName("");
    reset();
  };

  if (submitted) return <ThankYou name={submittedName} onReset={handleReset} />;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="gradient-hero text-primary-foreground py-6 px-4 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center relative pt-8 sm:pt-0">
          <div className="absolute top-0 left-0 sm:-ml-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-white/80 hover:bg-white/10">
                ← Back
              </Button>
            </Link>
          </div>
          {/* <img
            src="/LOGO%20PR%20LEARNING.png"
            alt="Profenger Learning"
            className="h-10 w-auto object-contain mt-8 mb-4 sm:absolute sm:left-0 sm:mt-0 sm:mb-0 sm:h-12 sm:top-1/2 sm:-translate-y-1/2"
          /> */}
          <div className="text-center sm:pl-16">
            {/* Added padding left on desktop to balance if needed, or just center text normally */}
            <h1 className="text-xl sm:text-3xl font-black leading-tight">
              Behind Every App
            </h1>
            <p className="text-primary-foreground/80 text-xs sm:text-sm">
              Career Awareness Session · Priyadarshini Arts and Science College, Melmuri, Malappuram · 24/02/2026
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">Share Your Feedback</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your honest feedback helps us improve future sessions.
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
                    placeholder="9876543210"
                    {...register("phone")}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address <span className="text-muted-foreground font-normal">(Optional)</span></Label>
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
                Your Feedback
              </h3>

              {/* Overall Rating */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                <Label className="block mb-4 text-base font-medium">
                  How would you rate this Career Awareness Session? <span className="text-destructive">*</span>
                </Label>
                <div className="flex justify-center">
                  <StarRating
                    value={overallRating}
                    onChange={(val) => setValue("overall_rating", val)}
                    size="lg" label={""} />
                </div>
                {errors.overall_rating && <p className="text-destructive text-sm mt-2">{errors.overall_rating.message}</p>}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              {/* <h3 className="text-sm font-semibold text-primary uppercase tracking-wider border-b border-border pb-2">
                Additional Comments
              </h3> */}
              <div className="flex items-start gap-3 bg-secondary/40 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="comments">Your thoughts, suggestions, or feedback <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="comments"
                    placeholder="Share anything you'd like — what you enjoyed, what could be improved..."
                    rows={4}
                    {...register("comments")}
                    className={`resize-none ${errors.comments ? "border-destructive" : ""}`}
                  />
                  {errors.comments && <p className="text-destructive text-xs">{errors.comments.message}</p>}
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
