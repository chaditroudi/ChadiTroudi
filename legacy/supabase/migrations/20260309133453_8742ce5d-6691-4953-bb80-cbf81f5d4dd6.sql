
-- Islands table
CREATE TABLE IF NOT EXISTS public.islands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text DEFAULT '🏝️',
  order_index integer NOT NULL DEFAULT 0,
  color text DEFAULT 'primary',
  unlock_requirement_xp integer DEFAULT 0,
  unlock_requirement_completion numeric DEFAULT 80,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.islands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view islands" ON public.islands
  FOR SELECT TO public USING (true);

-- Island Progress table
CREATE TABLE IF NOT EXISTS public.island_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  island_id uuid NOT NULL REFERENCES public.islands(id) ON DELETE CASCADE,
  completion_percentage numeric DEFAULT 0,
  boss_completed boolean DEFAULT false,
  unlocked boolean DEFAULT false,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, island_id)
);

ALTER TABLE public.island_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own island progress" ON public.island_progress
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own island progress" ON public.island_progress
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own island progress" ON public.island_progress
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Link existing levels to islands
ALTER TABLE public.platform_levels
  ADD COLUMN IF NOT EXISTS island_id uuid REFERENCES public.islands(id),
  ADD COLUMN IF NOT EXISTS is_boss boolean DEFAULT false;
