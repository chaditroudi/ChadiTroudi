import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "./use-platform-auth";

// ─── Types ───
export type Plan = "free" | "starter" | "pro" | "bootcamp";

export interface PlanLimits {
  plan: string;
  display_name: string;
  monthly_price_tnd: number;
  ai_tokens_monthly: number;
  challenge_evals_per_day: number;
  can_access_playground: boolean;
  can_access_ai_courses: boolean;
  can_access_interview_coach: boolean;
  can_access_debug_detective: boolean;
  can_access_1on1: boolean;
  max_course_generations: number;
  custom_learning_path: boolean;
  priority_support: boolean;
}

export interface SubscriptionState {
  plan: Plan;
  status: "active" | "trial" | "expired" | "cancelled";
  aiTokens: number;
  trialEndsAt: Date | null;
  subscriptionEndsAt: Date | null;
  isTrialActive: boolean;
  daysLeftInTrial: number;
  planLimits: PlanLimits | null;
  allPlans: PlanLimits[];
  loading: boolean;
}

export type Feature =
  | "playground"
  | "ai_courses"
  | "interview_coach"
  | "debug_detective"
  | "1on1"
  | "custom_learning_path"
  | "priority_support";

interface SubscriptionContextType extends SubscriptionState {
  canAccess: (feature: Feature) => boolean;
  consumeTokens: (amount: number, source: string, description?: string) => Promise<boolean>;
  hasTokens: (amount: number) => boolean;
  getEffectivePlan: () => Plan;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
};

// ─── Provider ───
export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = usePlatformAuth();
  const [state, setState] = useState<SubscriptionState>({
    plan: "free",
    status: "active",
    aiTokens: 50,
    trialEndsAt: null,
    subscriptionEndsAt: null,
    isTrialActive: false,
    daysLeftInTrial: 0,
    planLimits: null,
    allPlans: [],
    loading: true,
  });

  const loadSubscription = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    const [profileRes, plansRes] = await Promise.all([
      supabase
        .from("student_profiles")
        .select("subscription_plan, subscription_status, ai_tokens, trial_started_at, trial_ends_at, subscription_started_at, subscription_ends_at")
        .eq("user_id", user.id)
        .maybeSingle(),
      (supabase as any).from("plan_limits").select("*").order("monthly_price_tnd"),
    ]);

    const allPlans = (plansRes.data || []) as unknown as PlanLimits[];
    const profile = profileRes.data as any;

    if (!profile) {
      setState(prev => ({ ...prev, loading: false, allPlans }));
      return;
    }

    const plan = (profile.subscription_plan || "free") as Plan;
    const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
    const now = new Date();
    const isTrialActive = trialEndsAt ? trialEndsAt > now : false;
    const daysLeftInTrial = trialEndsAt
      ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    // During trial, user gets pro-level access
    const effectivePlan = isTrialActive && plan === "free" ? "pro" : plan;
    const planLimits = allPlans.find(p => p.plan === effectivePlan) || null;

    const status: SubscriptionState["status"] = isTrialActive
      ? "trial"
      : profile.subscription_status === "cancelled"
      ? "cancelled"
      : profile.subscription_ends_at && new Date(profile.subscription_ends_at) < now
      ? "expired"
      : "active";

    setState({
      plan,
      status,
      aiTokens: profile.ai_tokens || 0,
      trialEndsAt,
      subscriptionEndsAt: profile.subscription_ends_at ? new Date(profile.subscription_ends_at) : null,
      isTrialActive,
      daysLeftInTrial,
      planLimits,
      allPlans,
      loading: false,
    });
  }, [user]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const getEffectivePlan = useCallback((): Plan => {
    if (state.isTrialActive && state.plan === "free") return "pro";
    return state.plan;
  }, [state.isTrialActive, state.plan]);

  const canAccess = useCallback(
    (feature: Feature): boolean => {
      if (!state.planLimits) return false;
      const featureMap: Record<Feature, keyof PlanLimits> = {
        playground: "can_access_playground",
        ai_courses: "can_access_ai_courses",
        interview_coach: "can_access_interview_coach",
        debug_detective: "can_access_debug_detective",
        "1on1": "can_access_1on1",
        custom_learning_path: "custom_learning_path",
        priority_support: "priority_support",
      };
      return !!state.planLimits[featureMap[feature]];
    },
    [state.planLimits]
  );

  const hasTokens = useCallback(
    (amount: number) => state.aiTokens >= amount,
    [state.aiTokens]
  );

  const consumeTokens = useCallback(
    async (amount: number, source: string, description?: string): Promise<boolean> => {
      if (!user || state.aiTokens < amount) return false;

      const newBalance = state.aiTokens - amount;

      const { error: updateError } = await (supabase as any)
        .from("student_profiles")
        .update({ ai_tokens: newBalance })
        .eq("user_id", user.id);

      if (updateError) return false;

      await (supabase as any).from("token_transactions").insert({
        user_id: user.id,
        amount: -amount,
        balance_after: newBalance,
        type: "consume",
        source,
        description: description || `Used ${amount} tokens for ${source}`,
      });

      setState(prev => ({ ...prev, aiTokens: newBalance }));
      return true;
    },
    [user, state.aiTokens]
  );

  const value = useMemo(
    () => ({
      ...state,
      canAccess,
      consumeTokens,
      hasTokens,
      getEffectivePlan,
      refreshSubscription: loadSubscription,
    }),
    [state, canAccess, consumeTokens, hasTokens, getEffectivePlan, loadSubscription]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
