
-- Enable RLS and create a public read policy for the products table (safe for demo/public environments).
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (true);
