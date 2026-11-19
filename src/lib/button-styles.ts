import { cn } from "@/lib/utils";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]";

export const buttonStyles = {
  primary: cn(buttonBase, "bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:brightness-110"),
  secondary: cn(buttonBase, "border border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/50"),
  ghost: cn(buttonBase, "px-3 text-muted-foreground hover:text-foreground"),
};
