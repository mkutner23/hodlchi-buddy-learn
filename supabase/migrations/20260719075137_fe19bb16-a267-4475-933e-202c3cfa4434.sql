
-- Invite codes for private beta gating
CREATE TABLE public.invite_codes (
  code text PRIMARY KEY,
  label text,
  max_uses integer NOT NULL DEFAULT 1,
  used_count integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.invite_codes TO service_role;
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: server functions use service_role only.

CREATE TABLE public.invite_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL REFERENCES public.invite_codes(code) ON DELETE CASCADE,
  device_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (code, device_id)
);

GRANT ALL ON public.invite_redemptions TO service_role;
ALTER TABLE public.invite_redemptions ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: server functions use service_role only.

CREATE INDEX invite_redemptions_device_idx ON public.invite_redemptions (device_id);

-- Seed a few starter invite codes for the private beta.
INSERT INTO public.invite_codes (code, label, max_uses) VALUES
  ('HODLCHI-FOUNDERS', 'Founders round', 50),
  ('PENNY-BETA', 'Public beta seed', 200),
  ('HATCH-2026', 'General private beta', 500),
  ('INVESTOR-PREVIEW', 'Investor / advisor preview', 25);
