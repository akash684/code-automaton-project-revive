
-- VEHICLES table for rental/buying portal
CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('car', 'bike')), -- Category: car or bike
  brand text NOT NULL,
  model text NOT NULL,
  fuel text,           -- petrol, diesel, electric, hybrid
  transmission text,   -- manual, automatic
  price numeric NOT NULL, -- Rental or sale price
  available boolean DEFAULT true, -- in stock status
  image_url text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ACCESSORIES table for rental/buying portal
CREATE TABLE IF NOT EXISTS public.accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'Helmet', 'Gloves', 'Jackets', 'Mobile Mounts', 'GPS Tracker'
  )),
  compatible_vehicle_types text[] NOT NULL, -- ARRAY of [car, bike]
  price numeric NOT NULL, -- Rental or sale price
  stock integer NOT NULL DEFAULT 0,
  available boolean DEFAULT true,
  image_url text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- POLICIES: allow public read (so the UI works), lock down writes for now (adjust later)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view vehicles" ON public.vehicles FOR SELECT USING (true);

ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view accessories" ON public.accessories FOR SELECT USING (true);
