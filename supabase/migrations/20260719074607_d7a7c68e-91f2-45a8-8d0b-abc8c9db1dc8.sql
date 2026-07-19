CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  name text NOT NULL,
  path text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  locale text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX analytics_events_device_id_idx ON public.analytics_events (device_id);
CREATE INDEX analytics_events_name_idx ON public.analytics_events (name);
CREATE INDEX analytics_events_created_at_idx ON public.analytics_events (created_at DESC);

GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) can insert their own events.
-- device_id is client-generated random; not tied to any user identity.
CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(device_id) BETWEEN 8 AND 64
    AND length(name) BETWEEN 1 AND 80
    AND (path IS NULL OR length(path) <= 200)
    AND (locale IS NULL OR length(locale) <= 8)
    AND (user_agent IS NULL OR length(user_agent) <= 500)
  );

-- No SELECT/UPDATE/DELETE policies: reads happen via service_role in a
-- token-gated server function.