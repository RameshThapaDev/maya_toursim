import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", size = "md", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft",
    ghost: "bg-transparent text-foreground hover:bg-muted",
    outline: "border border-border bg-transparent hover:bg-muted",
    subtle: "bg-muted text-foreground hover:bg-muted/70"
  };
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6",
    lg: "h-12 px-7 text-base"
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
