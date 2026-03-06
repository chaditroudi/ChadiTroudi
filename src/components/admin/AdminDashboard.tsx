import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Check, X, Trash2, Star, LogOut, Shield } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

const AdminDashboard = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const { toast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (filter !== "all") {
      query = query.eq("status", filter);
    }
    const { data, error } = await query;
    if (error) {
      toast({ title: "Error", description: "Failed to load reviews", variant: "destructive" });
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to update review", variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Review ${status}` });
      fetchReviews();
    }
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete review", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Review removed" });
      fetchReviews();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-500 border-green-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-primary" />
            <h1 className="text-lg font-bold">Admin — Review Management</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-8">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No {filter} reviews found.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{review.name}</h3>
                      <span className="text-muted-foreground text-sm">{review.role}</span>
                      {review.company && (
                        <span className="text-muted-foreground text-xs">@ {review.company}</span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[review.status]}`}
                      >
                        {review.status}
                      </span>
                    </div>

                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-primary text-primary" />
                      ))}
                    </div>

                    {review.project && (
                      <span className="text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary mb-2 inline-block">
                        {review.project}
                      </span>
                    )}

                    <p className="text-foreground/80 text-sm leading-relaxed mt-2">
                      {review.content}
                    </p>

                    <p className="text-muted-foreground text-xs mt-3">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {review.status !== "approved" && (
                      <button
                        onClick={() => updateStatus(review.id, "approved")}
                        className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {review.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(review.id, "rejected")}
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
