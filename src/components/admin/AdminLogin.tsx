import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Shield, Mail, Lock } from "lucide-react";

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "You don't have admin permissions.", variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Welcome back!", description: "Admin access granted." });
    onLogin();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{isSignUp ? "Create Account" : "Admin Login"}</h1>
          <p className="text-muted-foreground text-sm mt-1">{isSignUp ? "Sign up to request admin access" : "Sign in to manage reviews"}</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Mail size={14} className="text-primary" /> Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full rounded-xl bg-card/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Lock size={14} className="text-primary" /> Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl bg-card/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-full hover:shadow-[0_0_40px_-5px_hsl(45_100%_60%/0.5)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (isSignUp ? "Creating account…" : "Signing in…") : (isSignUp ? "Sign Up" : "Sign In")}
          </motion.button>
        </form>

        <div className="text-center text-muted-foreground text-xs mt-6 space-y-2">
          <button onClick={() => setIsSignUp(!isSignUp)} className="hover:text-primary transition-colors block mx-auto">
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>
          <a href="/" className="hover:text-primary transition-colors block">← Back to portfolio</a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
