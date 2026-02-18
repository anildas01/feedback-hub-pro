import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  label: string;
  size?: "sm" | "md" | "lg";
}

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export const StarRating = ({ value, onChange, label, size = "md" }: StarRatingProps) => {
  const starSize = size === "lg" ? "w-10 h-10" : size === "sm" ? "w-4 h-4" : "w-8 h-8";
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={cn(
                starSize,
                "transition-colors",
                star <= value
                  ? "fill-star text-star"
                  : "text-star-empty hover:text-star"
              )}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-muted-foreground font-medium">
            {ratingLabels[value]}
          </span>
        )}
      </div>
    </div>
  );
};
