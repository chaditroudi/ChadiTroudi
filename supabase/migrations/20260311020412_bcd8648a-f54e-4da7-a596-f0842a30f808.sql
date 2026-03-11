
-- Add portfolio_public flag to student_profiles
ALTER TABLE public.student_profiles ADD COLUMN IF NOT EXISTS portfolio_public boolean NOT NULL DEFAULT false;
ALTER TABLE public.student_profiles ADD COLUMN IF NOT EXISTS portfolio_bio text DEFAULT null;

-- Allow anyone to view public student profiles (limited fields via app code)
CREATE POLICY "Anyone can view public profiles"
  ON public.student_profiles FOR SELECT
  TO public
  USING (portfolio_public = true);

-- Allow anyone to view projects of users with public portfolios
CREATE POLICY "Anyone can view public portfolio projects"
  ON public.student_projects FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.student_profiles
      WHERE student_profiles.user_id = student_projects.user_id
        AND student_profiles.portfolio_public = true
    )
  );
