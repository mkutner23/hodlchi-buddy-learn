
CREATE TABLE public.interview_signups (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  email text not null,
  note text,
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.interview_signups TO anon, authenticated;
GRANT ALL ON public.interview_signups TO service_role;
ALTER TABLE public.interview_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can sign up for interviews"
  ON public.interview_signups FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(device_id) between 8 and 64
    AND length(email) between 4 and 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (note IS NULL OR length(note) <= 1000)
  );

CREATE TABLE public.product_feedback (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  rating text not null,
  text text,
  surface text,
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.product_feedback TO anon, authenticated;
GRANT ALL ON public.product_feedback TO service_role;
ALTER TABLE public.product_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can leave feedback"
  ON public.product_feedback FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(device_id) between 8 and 64
    AND length(rating) between 1 and 40
    AND (text IS NULL OR length(text) <= 2000)
    AND (surface IS NULL OR length(surface) <= 60)
  );
