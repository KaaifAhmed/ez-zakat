-- Add RLS policies for daily_currency_rates table
-- Currency rates are public data needed by all users (guest and authenticated)
-- Only service role (edge functions) should be able to write

-- Allow everyone to read currency rates
CREATE POLICY "Anyone can view currency rates"
ON public.daily_currency_rates
FOR SELECT
USING (true);

-- Note: INSERT/UPDATE/DELETE operations are restricted to service role only
-- The edge function uses service role key to write data, bypassing RLS
-- This is secure because only our edge function can write, preventing manipulation