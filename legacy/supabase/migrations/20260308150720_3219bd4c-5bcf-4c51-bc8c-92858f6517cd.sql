
CREATE TABLE public.formation_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience_level TEXT NOT NULL DEFAULT 'beginner',
  motivation TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.formation_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register" ON public.formation_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view registrations" ON public.formation_registrations
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
