
-- Student profiles
CREATE TABLE public.student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  current_level integer NOT NULL DEFAULT 1,
  total_xp integer NOT NULL DEFAULT 0,
  streak_days integer NOT NULL DEFAULT 0,
  last_active_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.student_profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.student_profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.student_profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Levels
CREATE TABLE public.platform_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  description text,
  required_xp integer NOT NULL DEFAULT 0,
  icon text DEFAULT '🎯',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view levels" ON public.platform_levels FOR SELECT TO public USING (true);

-- Lessons
CREATE TABLE public.platform_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id uuid REFERENCES public.platform_levels(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  content jsonb NOT NULL DEFAULT '{}',
  order_index integer NOT NULL DEFAULT 0,
  xp_reward integer NOT NULL DEFAULT 50,
  lesson_type text NOT NULL DEFAULT 'lesson',
  language text DEFAULT 'javascript',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view lessons" ON public.platform_lessons FOR SELECT TO public USING (true);

-- User progress
CREATE TABLE public.user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES public.platform_lessons(id) ON DELETE CASCADE NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  score integer DEFAULT 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.user_lesson_progress
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress" ON public.user_lesson_progress
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON public.user_lesson_progress
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- XP Logs
CREATE TABLE public.xp_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  source text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.xp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own XP logs" ON public.xp_logs
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own XP logs" ON public.xp_logs
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Achievements
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text DEFAULT '🏆',
  criteria jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT TO public USING (true);

-- User achievements
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own achievements" ON public.user_achievements
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Auto-create student profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.student_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_student
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_student();
