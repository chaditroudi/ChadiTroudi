import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Copies the email address and confirms it in place (and to screen readers). */
const CopyEmail = ({ className }: { className?: string }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      track("email_copy");
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {copied ? <Check size={15} className="text-primary" aria-hidden /> : <Copy size={15} aria-hidden />}
      <span>{copied ? "Copied" : "Copy email"}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? `${profile.email} copied to clipboard` : ""}
      </span>
    </button>
  );
};

export default CopyEmail;
