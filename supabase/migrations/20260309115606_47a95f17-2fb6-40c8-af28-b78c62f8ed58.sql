
CREATE TABLE public.coding_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  language text NOT NULL DEFAULT 'javascript',
  category text NOT NULL DEFAULT 'general',
  starter_code text NOT NULL DEFAULT '',
  hints text[] DEFAULT '{}',
  expected_output text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coding_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view challenges" ON public.coding_challenges
  FOR SELECT TO public USING (true);
