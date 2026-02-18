import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { ThankYou } from "@/components/ThankYou";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lightbulb, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

// Schema for prompt submission
const schema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z.string().trim().regex(/^[0-9+\-\s()]{7,15}$/, "Please enter a valid phone number"),
    prompt: z.string().min(10, "Prompt must be at least 10 characters").max(2000, "Prompt limit is 2000 characters"),
});

type FormData = z.infer<typeof schema>;

const PromptSubmission = () => {
    const { toast } = useToast();
    const [submitted, setSubmitted] = useState(false);
    const [submittedName, setSubmittedName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setSubmitting(true);
        try {
            const { error } = await supabase.from("prompt_submissions").insert({
                name: data.name,
                email: data.email,
                phone: data.phone,
                prompt: data.prompt,
            });

            if (error) throw error;

            setSubmittedName(data.name.split(" ")[0]);
            setSubmitted(true);
        } catch (err) {
            console.error("Error submitting prompt:", err);
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

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                        <Trophy className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Challenge Accepted, {submittedName}!</h2>
                    <p className="text-muted-foreground">
                        Your prompt has been submitted. Get ready to see if your idea comes to life!
                    </p>
                    <div className="pt-4 flex flex-col gap-3">
                        <Button onClick={handleReset} variant="outline" className="w-full">
                            Submit Another Idea
                        </Button>
                        <Link to="/">
                            <Button className="w-full">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-8 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-0.5 text-xs font-medium text-white mb-4 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 mr-1.5" />
                        AI Prompt Challenge
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
                        Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">The Future</span>
                    </h1>
                    <p className="text-white/80 text-base max-w-2xl mx-auto leading-relaxed">
                        Unleash your <strong>Logical Thinking</strong>, propose a <strong>New Idea</strong>, and craft a <strong>New Design</strong>.
                        Give us a prompt based on the theme, and we might build it live!
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-yellow-300 text-sm font-bold bg-white/10 py-1.5 px-3 rounded-lg inline-block backdrop-blur-sm">
                        <Trophy className="w-4 h-4 inline mr-1" /> Win Exciting Prizes for the Best Prompt!
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
                <div className="bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground">Submit Your Prompt</h2>
                        <p className="text-muted-foreground mt-2">
                            Provide your details and your creative prompt below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Personal Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider border-b border-border pb-2 flex items-center">
                                User Details
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="name"
                                        placeholder="Your full name"
                                        {...register("name")}
                                        className={errors.name ? "border-destructive bg-destructive/5" : "bg-secondary/20"}
                                    />
                                    {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            {...register("email")}
                                            className={errors.email ? "border-destructive bg-destructive/5" : "bg-secondary/20"}
                                        />
                                        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="phone"
                                            placeholder="+91 XXXXX XXXXX"
                                            {...register("phone")}
                                            className={errors.phone ? "border-destructive bg-destructive/5" : "bg-secondary/20"}
                                        />
                                        {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prompt Section */}
                        <div className="space-y-4 pt-4">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider border-b border-border pb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" /> Your Idea
                            </h3>

                            <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
                                <Label htmlFor="prompt" className="mb-2 block text-base">
                                    Describe your website idea / prompt <span className="text-destructive">*</span>
                                </Label>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Be specific! Describe the layout, colors, functionality, and purpose. The more detailed, the better.
                                </p>
                                <Textarea
                                    id="prompt"
                                    placeholder="e.g., Create a landing page for a sustainable coffee brand with an earth-tone color palette, a hero section featuring a video background of coffee beans..."
                                    rows={8}
                                    {...register("prompt")}
                                    className={`resize-none text-base leading-relaxed ${errors.prompt ? "border-destructive bg-destructive/5" : "bg-background"}`}
                                />
                                {errors.prompt && <p className="text-destructive text-xs mt-2">{errors.prompt.message}</p>}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Submitting your idea...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" /> Submit Prompt
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm text-muted-foreground/80">
                    <p>Logical Thinking • New Idea • New Design</p>
                </div>
            </div>
        </div>
    );
};

export default PromptSubmission;
