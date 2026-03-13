import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Crown, Zap, Check, ArrowRight, Receipt,
  CreditCard, Sparkles, Shield, Clock, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSubscription, type Plan } from "@/hooks/use-subscription";
import { PaywallModal, TokenPurchaseModal } from "@/components/platform/SaasGate";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { useToast } from "@/hooks/use-toast";

interface TokenTransaction {
  id: string;
  amount: number;
  balance_after: number;
  type: string;
  source: string;
  description: string;
  created_at: string;
}

const planColors: Record<Plan, { bg: string; border: string; text: string }> = {
  free: { bg: "from-gray-500/10 to-gray-600/5", border: "border-gray-500/20", text: "text-gray-500" },
  starter: { bg: "from-blue-500/10 to-blue-600/5", border: "border-blue-500/20", text: "text-blue-500" },
  pro: { bg: "from-primary/10 to-emerald-500/5", border: "border-primary/20", text: "text-primary" },
  bootcamp: { bg: "from-amber-500/10 to-orange-500/5", border: "border-amber-500/20", text: "text-amber-500" },
};

const BillingPage = () => {
  const { user } = usePlatformAuth();
  const sub = useSubscription();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showBuyTokens, setShowBuyTokens] = useState(false);

  // Handle Stripe checkout return
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast({ title: "Payment successful! 🎉", description: "Your account has been updated. Changes may take a moment to reflect." });
      setSearchParams({}, { replace: true });
      // Refresh subscription data after payment
      sub.refreshSubscription?.();
    } else if (status === "cancelled") {
      toast({ title: "Payment cancelled", description: "No changes were made to your account." });
      setSearchParams({}, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    (supabase as any)
      .from("token_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setTransactions(data as unknown as TokenTransaction[]);
      });
  }, [user?.id]);

  const effectivePlan = sub.getEffectivePlan();
  const colors = planColors[effectivePlan];
  const planLimit = sub.planLimits;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Billing & Subscription</h1>
        <p className="text-muted-foreground text-sm mb-8">Manage your plan, tokens, and payment history</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-6 relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 -mr-10 -mt-10" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-background/60 flex items-center justify-center`}>
                  <Crown className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="text-xl font-bold text-foreground">{planLimit?.display_name || "Free"}</p>
                </div>
              </div>
              {sub.isTrialActive && (
                <Badge className="bg-primary text-primary-foreground">
                  <Sparkles className="w-3 h-3 mr-1" /> Trial
                </Badge>
              )}
            </div>

            {sub.isTrialActive && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Trial period</span>
                  <span>{sub.daysLeftInTrial} days left</span>
                </div>
                <Progress value={((7 - sub.daysLeftInTrial) / 7) * 100} className="h-2" />
              </div>
            )}

            {sub.subscriptionEndsAt && !sub.isTrialActive && (
              <p className="text-xs text-muted-foreground mb-4">
                <Clock className="w-3 h-3 inline mr-1" />
                {sub.status === "expired" ? "Expired" : "Renews"} on {formatDate(sub.subscriptionEndsAt.toISOString())}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-background/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Monthly Tokens</p>
                <p className="text-lg font-bold text-foreground">{planLimit?.ai_tokens_monthly || 50}</p>
              </div>
              <div className="bg-background/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Daily Evals</p>
                <p className="text-lg font-bold text-foreground">
                  {planLimit?.challenge_evals_per_day === -1 ? "∞" : planLimit?.challenge_evals_per_day || 5}
                </p>
              </div>
            </div>

            {effectivePlan !== "bootcamp" && (
              <Button
                onClick={() => setShowUpgrade(true)}
                className="w-full gap-2"
              >
                <TrendingUp className="w-4 h-4" /> Upgrade Plan
              </Button>
            )}
          </div>
        </motion.div>

        {/* Token Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-yellow-500/5 -mr-10 -mt-10" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-background/60 flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Token Balance</p>
                <p className="text-3xl font-bold text-foreground">{sub.aiTokens}</p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Token Usage This Month</span>
                <span className="text-foreground font-medium">{sub.aiTokens} remaining</span>
              </div>
              <Progress value={(sub.aiTokens / (planLimit?.ai_tokens_monthly || 50)) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5 text-center">
              <div className="bg-background/40 rounded-lg p-2.5">
                <p className="text-xs text-muted-foreground">AI Chat</p>
                <p className="text-sm font-bold text-foreground">5/msg</p>
              </div>
              <div className="bg-background/40 rounded-lg p-2.5">
                <p className="text-xs text-muted-foreground">Code Eval</p>
                <p className="text-sm font-bold text-foreground">10/eval</p>
              </div>
              <div className="bg-background/40 rounded-lg p-2.5">
                <p className="text-xs text-muted-foreground">Course Gen</p>
                <p className="text-sm font-bold text-foreground">25/gen</p>
              </div>
            </div>

            <Button
              onClick={() => setShowBuyTokens(true)}
              className="w-full gap-2 bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              <Zap className="w-4 h-4" /> Buy More Tokens
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Feature Access */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6 mb-8"
      >
        <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Feature Access
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "Coding Playground", has: planLimit?.can_access_playground },
            { name: "AI Course Generator", has: planLimit?.can_access_ai_courses },
            { name: "Interview Coach", has: planLimit?.can_access_interview_coach },
            { name: "Debug Detective", has: planLimit?.can_access_debug_detective },
            { name: "1-on-1 Sessions", has: planLimit?.can_access_1on1 },
            { name: "Custom Learning Path", has: planLimit?.custom_learning_path },
          ].map(f => (
            <div
              key={f.name}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${
                f.has ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30"
              }`}
            >
              <Check className={`w-4 h-4 ${f.has ? "text-primary" : "text-muted-foreground/30"}`} />
              <span className={`text-sm ${f.has ? "text-foreground" : "text-muted-foreground"}`}>{f.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-primary" /> Token History
        </h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.amount > 0 ? "bg-primary/10" : "bg-orange-500/10"
                  }`}>
                    {tx.amount > 0 ? (
                      <ArrowRight className="w-4 h-4 text-primary rotate-[-45deg]" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-orange-500 rotate-[135deg]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDate(tx.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount > 0 ? "text-primary" : "text-orange-500"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{tx.balance_after} bal</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <PaywallModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      <TokenPurchaseModal open={showBuyTokens} onClose={() => setShowBuyTokens(false)} />
    </div>
  );
};

export default BillingPage;
