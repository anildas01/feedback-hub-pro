import { CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThankYouProps {
  name: string;
  onReset: () => void;
}

export const ThankYou = ({ name, onReset }: ThankYouProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center shadow-btn">
              <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute inset-0 rounded-full gradient-hero animate-ping opacity-20" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Thank You, {name}! 🎉
        </h1>
        <p className="text-muted-foreground text-lg mb-4">
          Your feedback has been submitted successfully.
        </p>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8">
          <p className="text-sm text-foreground/80">
            We truly appreciate you taking the time to share your experience at the{" "}
            <span className="font-semibold text-primary">"Behind Every App"</span>{" "}
            Career Awareness Session. Your feedback helps us make future sessions even better!
          </p>
        </div>

        {/* Branding */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground mb-1">Organized by</p>
          <p className="font-bold text-primary text-lg">Profenger Learning</p>
          <p className="text-xs text-muted-foreground">Department of Commerce · NSS College Manjeri</p>
        </div>

        <button
          onClick={onReset}
          className="mt-6 text-sm text-muted-foreground underline hover:text-primary transition-colors"
        >
          Submit another response
        </button>
      </div>
    </div>
  );
};
