
-- Add onboarding fields to student_profiles
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS career_goal text,
  ADD COLUMN IF NOT EXISTS experience_level text DEFAULT 'beginner',
  ADD COLUMN IF NOT EXISTS known_languages text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS weekly_hours integer DEFAULT 5,
  ADD COLUMN IF NOT EXISTS learning_style text DEFAULT 'visual',
  ADD COLUMN IF NOT EXISTS assessment_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS assessment_score integer,
  ADD COLUMN IF NOT EXISTS weak_topics text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS strong_topics text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS recommended_level integer DEFAULT 1;

-- Create skill_assessments table for tracking assessment attempts
CREATE TABLE IF NOT EXISTS public.skill_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  completed_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own assessments" ON public.skill_assessments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own assessments" ON public.skill_assessments
  FOR SELECT TO authenticated USING (user_id = auth.uid());
