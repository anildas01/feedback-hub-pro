
-- Create feedback submissions table
CREATE TABLE public.feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  q1_rating INTEGER CHECK (q1_rating >= 1 AND q1_rating <= 5),
  q2_rating INTEGER CHECK (q2_rating >= 1 AND q2_rating <= 5),
  q3_rating INTEGER CHECK (q3_rating >= 1 AND q3_rating <= 5),
  q4_rating INTEGER CHECK (q4_rating >= 1 AND q4_rating <= 5),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (public feedback form)
CREATE POLICY "Anyone can submit feedback"
ON public.feedback_submissions
FOR INSERT
WITH CHECK (true);

-- Only authenticated users (admins) can view all submissions
CREATE POLICY "Admins can view all submissions"
ON public.feedback_submissions
FOR SELECT
TO authenticated
USING (true);

-- Create admin roles table
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
