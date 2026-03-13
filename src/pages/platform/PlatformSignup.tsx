import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Trophy, Target, Rocket, ChevronRight } from "lucide-react";
import { useLang } from "@/hooks/use-lang";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const PlatformSignup = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLang();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Sign out any existing session first
    await supabase.auth.signOut();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t.auth.accountCreated);
      navigate("/platform/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand / Visual */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] relative flex-col justify-between p-10 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[hsl(222,22%,5%)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 30% 80%, hsl(152 68% 46% / 0.12), transparent 60%), radial-gradient(ellipse 80% 100% at 90% 10%, hsl(172 66% 50% / 0.08), transparent 50%)",
          }}
        />
        <div className="absolute inset-0 dot-pattern opacity-30" />

        {/* Decorative code blocks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-[12%] -right-6 font-mono text-[11px] leading-relaxed text-white select-none whitespace-pre pointer-events-none"
        >
{`function levelUp(student) {
  student.xp += 100;
  student.skills.push(
    "problem-solving"
  );
  return student;
}`}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-[22%] -left-2 font-mono text-[10px] leading-relaxed text-white select-none whitespace-pre pointer-events-none"
        >
{`interface Engineer {
  name: string;
  stack: string[];
  mentor: boolean;
}`}
        </motion.div>

        {/* Top — Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold tracking-tight text-white">
              CT<span style={{ color: "hsl(152 68% 46%)" }}>.</span>
            </span>
          </Link>
        </div>

        {/* Center — Feature highlight */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div {...fadeUp(0.3)}>
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight mb-4">
              Start building
              <br />
              <span style={{ color: "hsl(152 68% 46%)" }}>your future</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-8">
              A structured path from fundamentals to production-ready skills, with real projects and mentorship.
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div {...fadeUp(0.5)} className="space-y-3">
            {[
              { icon: Target, label: "Skill assessment & custom path" },
              { icon: Trophy, label: "Earn XP & unlock achievements" },
              { icon: Rocket, label: "Ship real-world projects" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                  <item.icon size={14} style={{ color: "hsl(152 68% 46%)" }} />
                </div>
                <span className="text-white/70 text-sm">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom — Stats */}
        <motion.div {...fadeUp(0.7)} className="relative z-10">
          <div className="border-t border-white/[0.06] pt-6 flex items-center gap-6">
            {[
              { value: "200+", label: "Students" },
              { value: "50+", label: "Projects" },
              { value: "95%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6">
                <div>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">{stat.label}</p>
                </div>
                {i < 2 && <div className="w-px h-8 bg-white/[0.06]" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center relative bg-background">
        {/* Subtle bg */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 30%, hsl(152 68% 46% / 0.03), transparent)",
          }}
        />

        <div className="relative z-10 w-full max-w-[400px] px-6 sm:px-8">
          {/* Mobile logo */}
          <motion.div {...fadeUp(0)} className="lg:hidden text-center mb-10">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold tracking-tight">
                <span className="text-gradient">CT</span>
                <span className="text-primary">.</span>
              </span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div {...fadeUp(0.05)} className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">{t.auth.signUp}</h1>
            <p className="text-muted-foreground text-sm">
              {t.auth.signUpSubtitle}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form {...fadeUp(0.1)} onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.auth.fullName}</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t.auth.namePlaceholder}
                  required
                  autoFocus
                  className="w-full rounded-lg bg-background border border-border pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.auth.email}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth.emailPlaceholder}
                  required
                  className="w-full rounded-lg bg-background border border-border pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.auth.password}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full rounded-lg bg-background border border-border pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium text-sm py-2.5 rounded-lg hover:brightness-110 transition-all duration-200 disabled:opacity-50 mt-1"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
              ) : (
                <>
                  Create account
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </motion.form>

          {/* Divider */}
          <motion.div {...fadeUp(0.15)} className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Sign in link */}
          <motion.div {...fadeUp(0.2)}>
            <Link
              to="/platform/login"
              className="w-full flex items-center justify-center gap-2 border border-border text-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-accent/50 hover:border-primary/20 transition-all duration-200"
            >
              {t.auth.signInLink}
              <ChevronRight size={14} className="text-muted-foreground" />
            </Link>
          </motion.div>

          {/* Terms */}
          <motion.p {...fadeUp(0.25)} className="text-center text-[11px] text-muted-foreground/60 mt-6 leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </motion.p>

          {/* Back to site */}
          <motion.p {...fadeUp(0.3)} className="text-center mt-4">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              &larr; Back to site
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default PlatformSignup;
