import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, User, Briefcase, MessageSquare, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SubmitReviewForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    project: "",
    content: "",
    rating: 5,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.length > 100) e.name = "Max 100 characters";
    if (!form.role.trim()) e.role = "Role is required";
    else if (form.role.length > 100) e.role = "Max 100 characters";
    if (!form.content.trim()) e.content = "Review is required";
    else if (form.content.length > 1000) e.content = "Max 1000 characters";
    if (form.rating < 1 || form.rating > 5) e.rating = "Rating must be 1-5";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      name: form.name.trim(),
      role: form.role.trim(),
      company: form.company.trim() || null,
      project: form.project.trim() || null,
      content: form.content.trim(),
      rating: form.rating,
      status: "pending",
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: "Failed to submit review. Please try again.", variant: "destructive" });
      return;
    }

    toast({ title: "Thank you! 🎉", description: "Your review has been submitted and is pending approval." });
    setForm({ name: "", role: "", company: "", project: "", content: "", rating: 5 });
    setErrors({});
    onSuccess?.();
  };

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="glass rounded-3xl p-8 space-y-5">
      <h3 className="text-xl font-bold text-foreground mb-2">Leave a Review</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Your review will be visible after approval.
      </p>

      {/* Rating */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => update("rating", star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={24}
                className={`transition-colors ${
                  star <= form.rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="review-name" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
          <User size={14} className="text-primary" /> Your Name
        </label>
        <input
          id="review-name"
          type="text"
          maxLength={100}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="John Doe"
          className={`w-full rounded-xl bg-card/60 border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20 ${
            errors.name ? "border-destructive" : "border-border"
          }`}
        />
        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="review-role" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
          <Briefcase size={14} className="text-primary" /> Your Role
        </label>
        <input
          id="review-role"
          type="text"
          maxLength={100}
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
          placeholder="CTO, Product Manager, etc."
          className={`w-full rounded-xl bg-card/60 border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20 ${
            errors.role ? "border-destructive" : "border-border"
          }`}
        />
        {errors.role && <p className="text-destructive text-xs mt-1">{errors.role}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Company */}
        <div>
          <label htmlFor="review-company" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
            <Building size={14} className="text-primary" /> Company <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <input
            id="review-company"
            type="text"
            maxLength={100}
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Acme Inc."
            className="w-full rounded-xl bg-card/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* Project */}
        <div>
          <label htmlFor="review-project" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
            <MessageSquare size={14} className="text-primary" /> Project <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <input
            id="review-project"
            type="text"
            maxLength={100}
            value={form.project}
            onChange={(e) => update("project", e.target.value)}
            placeholder="E-Commerce Platform"
            className="w-full rounded-xl bg-card/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Review */}
      <div>
        <label htmlFor="review-content" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
          <MessageSquare size={14} className="text-primary" /> Your Review
        </label>
        <textarea
          id="review-content"
          rows={4}
          maxLength={1000}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          placeholder="Share your experience working with Chadi…"
          className={`w-full rounded-xl bg-card/60 border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 ${
            errors.content ? "border-destructive" : "border-border"
          }`}
        />
        {errors.content && <p className="text-destructive text-xs mt-1">{errors.content}</p>}
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-full hover:shadow-[0_0_40px_-5px_hsl(45_100%_60%/0.5)] transition-all duration-300 disabled:opacity-50"
      >
        <Send size={16} />
        {loading ? "Submitting…" : "Submit Review"}
      </motion.button>
    </form>
  );
};

export default SubmitReviewForm;
