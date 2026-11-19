
CREATE TABLE public.student_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  github_url TEXT,
  live_url TEXT,
  screenshot_url TEXT,
  technologies TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON public.student_projects
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own projects" ON public.student_projects
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects" ON public.student_projects
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can delete own projects" ON public.student_projects
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER update_student_projects_updated_at
  BEFORE UPDATE ON public.student_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
