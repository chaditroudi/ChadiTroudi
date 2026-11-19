
CREATE TABLE public.subscription_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  plan text NOT NULL DEFAULT 'starter',
  payment_method text NOT NULL DEFAULT 'd17',
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit subscription request" ON public.subscription_requests
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view subscription requests" ON public.subscription_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update subscription requests" ON public.subscription_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
