import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Zap, Check, Sparkles, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription, type Plan, type Feature } from "@/hooks/use-subscription";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";

// ─── Paywall Modal ───
interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  feature?: Feature;
  requiredPlan?: Plan;
}

const planOrder: Plan[] = ["free", "starter", "pro", "bootcamp"];

const planMeta: Record<Plan, { name: string; icon: typeof Crown; color: string; gradient: string }> = {
  free: { name: "Free", icon: Zap, color: "text-muted-foreground", gradient: "from-gray-500/20 to-gray-600/10" },
  starter: { name: "Starter", icon: Zap, color: "text-blue-500", gradient: "from-blue-500/20 to-blue-600/10" },
  pro: { name: "Pro", icon: Crown, color: "text-primary", gradient: "from-primary/20 to-emerald-500/10" },
  bootcamp: { name: "Bootcamp", icon: Sparkles, color: "text-amber-500", gradient: "from-amber-500/20 to-orange-500/10" },
};

const featureLabels: Record<Feature, string> = {
  playground: "Coding Playground",
  ai_courses: "AI Course Generator",
  interview_coach: "Interview Coach",
  debug_detective: "Debug Detective",
  "1on1": "1-on-1 Sessions",
  custom_learning_path: "Custom Learning Path",
  priority_support: "Priority Support",
};

export const PaywallModal = ({ open, onClose, feature, requiredPlan }: PaywallModalProps) => {
  const { allPlans, plan: currentPlan } = useSubscription();
  const { user } = usePlatformAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(requiredPlan || "pro");
  const [upgrading, setUpgrading] = useState(false);

  const upgradePlans = allPlans.filter(p => planOrder.indexOf(p.plan as Plan) > planOrder.indexOf(currentPlan));

  const handleUpgrade = async () => {
    if (!user) return;
    setUpgrading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("create-checkout", {
        body: { type: "subscription", plan: selectedPlan },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (res.error || !res.data?.url) {
        toast({ title: "Upgrade failed", description: res.error?.message || "Could not create checkout session.", variant: "destructive" });
        setUpgrading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = res.data.url;
    } catch {
      toast({ title: "Upgrade failed", description: "Please try again.", variant: "destructive" });
      setUpgrading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 pb-4 text-center border-b border-border">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {feature ? `Unlock ${featureLabels[feature]}` : "Upgrade Your Plan"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {feature
                  ? "This feature requires a higher plan. Upgrade to unlock."
                  : "Get more tokens, features, and learning power."}
              </p>
            </div>

            {/* Plan Cards */}
            <div className="p-6 space-y-3">
              {upgradePlans.map(p => {
                const meta = planMeta[p.plan as Plan];
                const isSelected = selectedPlan === p.plan;
                return (
                  <button
                    key={p.plan}
                    onClick={() => setSelectedPlan(p.plan as Plan)}
                    className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30 bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
                          <meta.icon className={`w-4 h-4 ${meta.color}`} />
                        </div>
                        <div>
                          <span className="font-bold text-foreground">{meta.name}</span>
                          {p.plan === "pro" && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-foreground">
                        {p.monthly_price_tnd} TND
                        <span className="text-xs text-muted-foreground font-normal">/mo</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> {p.ai_tokens_monthly} AI tokens/mo</span>
                      <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> {p.challenge_evals_per_day === -1 ? "Unlimited" : p.challenge_evals_per_day} evals/day</span>
                      {p.can_access_ai_courses && <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> AI Courses</span>}
                      {p.can_access_interview_coach && <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Interview Coach</span>}
                      {p.can_access_debug_detective && <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Debug Detective</span>}
                      {p.can_access_1on1 && <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> 1-on-1 Sessions</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <div className="p-6 pt-2">
              <Button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full py-6 text-base font-bold bg-primary hover:bg-primary/90 gap-2"
              >
                {upgrading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Upgrade to {planMeta[selectedPlan].name} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground mt-2">
                7-day money-back guarantee • Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── Token Purchase Modal ───
interface TokenPurchaseModalProps {
  open: boolean;
  onClose: () => void;
}

const tokenPacks = [
  { tokens: 100, price: 5, label: "100 Tokens", popular: false },
  { tokens: 500, price: 19, label: "500 Tokens", popular: true, savings: "24% off" },
  { tokens: 1500, price: 49, label: "1,500 Tokens", popular: false, savings: "35% off" },
  { tokens: 5000, price: 129, label: "5,000 Tokens", popular: false, savings: "48% off" },
];

export const TokenPurchaseModal = ({ open, onClose }: TokenPurchaseModalProps) => {
  const { aiTokens, refreshSubscription } = useSubscription();
  const { user } = usePlatformAuth();
  const { toast } = useToast();
  const [selectedPack, setSelectedPack] = useState(1); // default to popular
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!user) return;
    setPurchasing(true);
    const pack = tokenPacks[selectedPack];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("create-checkout", {
        body: { type: "tokens", tokenAmount: pack.tokens },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (res.error || !res.data?.url) {
        toast({ title: "Purchase failed", description: res.error?.message || "Could not create checkout session.", variant: "destructive" });
        setPurchasing(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = res.data.url;
    } catch {
      toast({ title: "Purchase failed", description: "Please try again.", variant: "destructive" });
      setPurchasing(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 pb-4 text-center border-b border-border">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 flex items-center justify-center">
                <Zap className="w-7 h-7 text-yellow-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Buy AI Tokens</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Current balance: <span className="font-bold text-foreground">{aiTokens} tokens</span>
              </p>
            </div>

            {/* Token Packs */}
            <div className="p-6 space-y-2.5">
              {tokenPacks.map((pack, i) => (
                <button
                  key={pack.tokens}
                  onClick={() => setSelectedPack(i)}
                  className={`w-full text-left rounded-xl p-4 border-2 transition-all relative ${
                    selectedPack === i
                      ? "border-yellow-500 bg-yellow-500/5 shadow-sm"
                      : "border-border hover:border-yellow-500/30 bg-card"
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-yellow-500 text-black text-[10px] font-bold uppercase">
                      Best Value
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{pack.label}</p>
                        {pack.savings && (
                          <p className="text-xs text-primary font-medium">{pack.savings}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-lg text-foreground">
                      {pack.price} <span className="text-xs text-muted-foreground font-normal">TND</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="p-6 pt-2">
              <Button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full py-6 text-base font-bold bg-yellow-500 hover:bg-yellow-600 text-black gap-2"
              >
                {purchasing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Buy {tokenPacks[selectedPack].label} for {tokenPacks[selectedPack].price} TND
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground mt-2">
                Tokens never expire • Use across all AI features
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── Feature Gate Component ───
interface FeatureGateProps {
  feature: Feature;
  tokenCost?: number;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate = ({ feature, tokenCost, children, fallback }: FeatureGateProps) => {
  const { canAccess, hasTokens } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);

  const hasAccess = canAccess(feature);
  const hasEnoughTokens = tokenCost ? hasTokens(tokenCost) : true;

  if (!hasAccess) {
    return (
      <>
        {fallback || (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Premium Feature</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              {featureLabels[feature]} is available on higher plans. Upgrade to unlock this and many more features.
            </p>
            <Button onClick={() => setShowPaywall(true)} className="gap-2">
              <Crown className="w-4 h-4" /> Upgrade Plan
            </Button>
          </div>
        )}
        <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} feature={feature} />
      </>
    );
  }

  if (!hasEnoughTokens) {
    return (
      <>
        {fallback || (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Not Enough Tokens</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              This action requires {tokenCost} tokens. Buy more tokens to continue.
            </p>
            <Button onClick={() => setShowTokenModal(true)} className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-black">
              <Zap className="w-4 h-4" /> Buy Tokens
            </Button>
          </div>
        )}
        <TokenPurchaseModal open={showTokenModal} onClose={() => setShowTokenModal(false)} />
      </>
    );
  }

  return <>{children}</>;
};

// ─── Free Trial Banner ───
export const TrialBanner = () => {
  const { isTrialActive, daysLeftInTrial, plan } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  if (!isTrialActive || plan !== "free") return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-3 rounded-xl bg-gradient-to-r from-primary/15 via-emerald-500/10 to-blue-500/15 border border-primary/20 px-4 py-3 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground">
              Free Trial • {daysLeftInTrial} day{daysLeftInTrial !== 1 ? "s" : ""} left
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              Full Pro access — upgrade before it expires
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setShowPaywall(true)}
          className="shrink-0 text-xs h-7 bg-primary hover:bg-primary/90"
        >
          Upgrade
        </Button>
      </motion.div>
      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />
    </>
  );
};

// ─── Token Balance Widget (for sidebar) ───
export const TokenBalanceWidget = ({ collapsed = false }: { collapsed?: boolean }) => {
  const { aiTokens, plan, getEffectivePlan } = useSubscription();
  const [showTokenModal, setShowTokenModal] = useState(false);
  const effectivePlan = getEffectivePlan();

  if (collapsed) {
    return (
      <>
        <button
          onClick={() => setShowTokenModal(true)}
          className="w-10 h-10 mx-auto rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center hover:bg-yellow-500/20 transition-colors"
          title={`${aiTokens} tokens`}
        >
          <Zap className="w-4 h-4 text-yellow-500" />
        </button>
        <TokenPurchaseModal open={showTokenModal} onClose={() => setShowTokenModal(false)} />
      </>
    );
  }

  return (
    <>
      <div className="rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-foreground">{aiTokens} tokens</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase">
            {planMeta[effectivePlan]?.name || "Free"}
          </span>
        </div>
        <button
          onClick={() => setShowTokenModal(true)}
          className="w-full text-center text-[11px] font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
        >
          + Buy more tokens
        </button>
      </div>
      <TokenPurchaseModal open={showTokenModal} onClose={() => setShowTokenModal(false)} />
    </>
  );
};

// ─── Inline Upgrade Nudge ───
export const UpgradeNudge = ({ feature, message }: { feature: Feature; message?: string }) => {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/15 text-xs">
        <Crown className="w-3.5 h-3.5 text-primary" />
        <span className="text-muted-foreground">{message || `Requires upgrade`}</span>
        <button onClick={() => setShowPaywall(true)} className="font-bold text-primary hover:underline">
          Upgrade
        </button>
      </div>
      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} feature={feature} />
    </>
  );
};
