
-- Create review status enum
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');

-- Create admin role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create reviews table (public submissions, no auth required to submit)
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  project TEXT,
  status review_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Reviews policies
-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON public.reviews FOR SELECT
  USING (status = 'approved');

-- Anyone can submit a review (public form)
CREATE POLICY "Anyone can submit a review"
  ON public.reviews FOR INSERT
  WITH CHECK (status = 'pending');

-- Admins can view all reviews
CREATE POLICY "Admins can view all reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update reviews (approve/reject)
CREATE POLICY "Admins can update reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete reviews
CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
