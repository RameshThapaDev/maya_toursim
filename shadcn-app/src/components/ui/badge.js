import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-muted text-foreground",
    solid: "bg-primary text-primary-foreground",
    outline: "border border-border text-foreground"
  };
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", variants[variant], className)}
      {...props}
    />
  );
}
