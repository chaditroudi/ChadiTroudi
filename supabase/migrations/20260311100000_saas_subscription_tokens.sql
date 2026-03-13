-- Add subscription/SaaS fields to student_profiles
ALTER TABLE student_profiles
  ADD COLUMN IF NOT EXISTS subscription_plan text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS trial_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS ai_tokens integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS lifetime_tokens_purchased integer NOT NULL DEFAULT 0;

-- Token transaction log
CREATE TABLE IF NOT EXISTS token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  balance_after integer NOT NULL,
  type text NOT NULL CHECK (type IN ('grant', 'purchase', 'consume', 'refund', 'trial_bonus', 'plan_bonus')),
  source text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own token transactions"
  ON token_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert token transactions"
  ON token_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Plan limits configuration table
CREATE TABLE IF NOT EXISTS plan_limits (
  plan text PRIMARY KEY,
  display_name text NOT NULL,
  monthly_price_tnd integer NOT NULL DEFAULT 0,
  ai_tokens_monthly integer NOT NULL DEFAULT 50,
  challenge_evals_per_day integer NOT NULL DEFAULT 5,
  can_access_playground boolean NOT NULL DEFAULT true,
  can_access_ai_courses boolean NOT NULL DEFAULT false,
  can_access_interview_coach boolean NOT NULL DEFAULT false,
  can_access_debug_detective boolean NOT NULL DEFAULT false,
  can_access_1on1 boolean NOT NULL DEFAULT false,
  max_course_generations integer NOT NULL DEFAULT 0,
  custom_learning_path boolean NOT NULL DEFAULT false,
  priority_support boolean NOT NULL DEFAULT false
);

ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read plan limits"
  ON plan_limits FOR SELECT
  USING (true);

-- Seed plan limits
INSERT INTO plan_limits (plan, display_name, monthly_price_tnd, ai_tokens_monthly, challenge_evals_per_day, can_access_playground, can_access_ai_courses, can_access_interview_coach, can_access_debug_detective, can_access_1on1, max_course_generations, custom_learning_path, priority_support)
VALUES
  ('free', 'Free', 0, 50, 5, true, false, false, false, false, 0, false, false),
  ('starter', 'Starter', 29, 200, 15, true, true, false, false, false, 3, false, false),
  ('pro', 'Pro', 79, 1000, -1, true, true, true, true, true, -1, true, true),
  ('bootcamp', 'Bootcamp', 199, 2000, -1, true, true, true, true, true, -1, true, true)
ON CONFLICT (plan) DO NOTHING;

-- Auto-grant free trial (7 days of Pro) for new signups
-- This is done in the trigger that creates student_profiles
CREATE OR REPLACE FUNCTION handle_new_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.student_profiles (user_id, display_name, trial_started_at, trial_ends_at, subscription_plan, ai_tokens)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email, 'Coder'),
    now(),
    now() + interval '7 days',
    'free',
    150
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Log the trial bonus tokens
  INSERT INTO public.token_transactions (user_id, amount, balance_after, type, source, description)
  VALUES (NEW.id, 150, 150, 'trial_bonus', 'signup', 'Welcome bonus: 150 AI tokens for your 7-day free trial');

  RETURN NEW;
END;
$$;
