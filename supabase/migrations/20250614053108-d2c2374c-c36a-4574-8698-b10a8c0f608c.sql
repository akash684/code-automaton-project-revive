
-- Update products table to include more detailed product information
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS price_inr numeric,
ADD COLUMN IF NOT EXISTS specs jsonb,
ADD COLUMN IF NOT EXISTS images text[],
ADD COLUMN IF NOT EXISTS delivery_days integer DEFAULT 7,
ADD COLUMN IF NOT EXISTS in_stock boolean DEFAULT true;

-- Update existing products to have price_inr (same as price for now)
UPDATE public.products SET price_inr = price WHERE price_inr IS NULL;

-- Create cart table for shopping cart functionality
CREATE TABLE IF NOT EXISTS public.cart (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id integer REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id integer REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Update orders table to include more details
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS item_type text CHECK (item_type IN ('car', 'bike', 'accessory')),
ADD COLUMN IF NOT EXISTS payment_id text,
ADD COLUMN IF NOT EXISTS delivery_address_line2 text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS order_notes text;

-- Create user profiles table for additional user info
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  pincode text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cart
CREATE POLICY "Users can view own cart" ON public.cart
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON public.cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON public.cart
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON public.cart
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for wishlist
CREATE POLICY "Users can view own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist items" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist items" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Update sample products with Indian pricing and specs
UPDATE public.products SET 
  price_inr = price,
  specs = CASE 
    WHEN category = 'car' THEN jsonb_build_object(
      'engine', CASE 
        WHEN name LIKE '%Swift%' THEN '1.2L Petrol'
        WHEN name LIKE '%City%' THEN '1.5L i-VTEC Petrol'
        WHEN name LIKE '%Nexon%' THEN '1.2L Revotron Petrol'
        WHEN name LIKE '%Creta%' THEN '1.5L CRDi Diesel'
        WHEN name LIKE '%Thar%' THEN '2.2L mHawk Diesel'
      END,
      'mileage', CASE 
        WHEN name LIKE '%Swift%' THEN '23 kmpl'
        WHEN name LIKE '%City%' THEN '17.8 kmpl'
        WHEN name LIKE '%Nexon%' THEN '17.57 kmpl'
        WHEN name LIKE '%Creta%' THEN '21.4 kmpl'
        WHEN name LIKE '%Thar%' THEN '15.2 kmpl'
      END,
      'seating', CASE 
        WHEN name LIKE '%Thar%' THEN '4'
        ELSE '5'
      END,
      'safety_rating', '5 Star'
    )
    WHEN category = 'bike' THEN jsonb_build_object(
      'engine', CASE 
        WHEN name LIKE '%Classic%' THEN '349cc Single Cylinder'
        WHEN name LIKE '%Shine%' THEN '124cc HET'
        WHEN name LIKE '%R15%' THEN '155cc Liquid Cooled'
        WHEN name LIKE '%Apache%' THEN '159.7cc Oil Cooled'
        WHEN name LIKE '%Pulsar%' THEN '199.5cc Triple Spark'
      END,
      'mileage', CASE 
        WHEN name LIKE '%Classic%' THEN '35-40 kmpl'
        WHEN name LIKE '%Shine%' THEN '55-60 kmpl'
        WHEN name LIKE '%R15%' THEN '40-45 kmpl'
        WHEN name LIKE '%Apache%' THEN '45-50 kmpl'
        WHEN name LIKE '%Pulsar%' THEN '35-40 kmpl'
      END,
      'power', CASE 
        WHEN name LIKE '%Classic%' THEN '20.2 bhp'
        WHEN name LIKE '%Shine%' THEN '10.74 bhp'
        WHEN name LIKE '%R15%' THEN '18.6 bhp'
        WHEN name LIKE '%Apache%' THEN '15.82 bhp'
        WHEN name LIKE '%Pulsar%' THEN '24.13 bhp'
      END
    )
    WHEN category = 'accessory' THEN jsonb_build_object(
      'material', CASE 
        WHEN name LIKE '%Seat Covers%' THEN 'Premium Leather'
        WHEN name LIKE '%Headlight%' THEN 'LED'
        WHEN name LIKE '%Camera%' THEN 'Full HD 1080p'
        WHEN name LIKE '%Mats%' THEN 'Waterproof Rubber'
        WHEN name LIKE '%Alarm%' THEN 'Wireless'
      END,
      'warranty', '1 Year',
      'compatibility', CASE 
        WHEN name LIKE '%Seat Covers%' OR name LIKE '%Mats%' OR name LIKE '%Camera%' THEN 'Universal Car'
        WHEN name LIKE '%Headlight%' THEN 'Most Vehicles'
        WHEN name LIKE '%Alarm%' THEN 'All Bikes'
      END
    )
  END,
  delivery_days = CASE 
    WHEN category = 'car' THEN 30
    WHEN category = 'bike' THEN 15
    WHEN category = 'accessory' THEN 3
  END;
