
-- First, let's see what columns already exist and add the missing ones
DO $$ 
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category') THEN
        ALTER TABLE public.products ADD COLUMN category text;
    END IF;
    
    -- Add other automobile-specific columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'type') THEN
        ALTER TABLE public.products ADD COLUMN type text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'brand') THEN
        ALTER TABLE public.products ADD COLUMN brand text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'model') THEN
        ALTER TABLE public.products ADD COLUMN model text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'year') THEN
        ALTER TABLE public.products ADD COLUMN year integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'fuel') THEN
        ALTER TABLE public.products ADD COLUMN fuel text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'transmission') THEN
        ALTER TABLE public.products ADD COLUMN transmission text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'mileage') THEN
        ALTER TABLE public.products ADD COLUMN mileage integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'location') THEN
        ALTER TABLE public.products ADD COLUMN location text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'featured') THEN
        ALTER TABLE public.products ADD COLUMN featured boolean DEFAULT false;
    END IF;
END $$;

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id integer REFERENCES public.products(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  delivery_address text NOT NULL,
  pincode text NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on orders if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view own orders'
    ) THEN
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own orders" ON public.orders
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can create own orders" ON public.orders
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Clear existing data and insert sample automobile data
DELETE FROM public.products;

-- Insert sample data using only existing columns first
INSERT INTO public.products (name, slug, description, price, image_url, stock, available) VALUES
-- Cars
('Maruti Suzuki Swift', 'maruti-suzuki-swift', 'Compact hatchback with excellent fuel efficiency', 750000, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500', 5, true),
('Honda City', 'honda-city', 'Premium sedan with advanced features', 1200000, 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500', 3, true),
('Tata Nexon', 'tata-nexon', 'Compact SUV with 5-star safety rating', 900000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500', 4, true),
('Hyundai Creta', 'hyundai-creta', 'Feature-packed mid-size SUV', 1400000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', 2, true),
('Mahindra Thar', 'mahindra-thar', 'Off-road SUV for adventure enthusiasts', 1600000, 'https://images.unsplash.com/photo-1606220588013-b20a4b02b748?w=500', 3, true),

-- Bikes
('Royal Enfield Classic 350', 'royal-enfield-classic-350', 'Iconic motorcycle with retro styling', 200000, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500', 8, true),
('Honda CB Shine', 'honda-cb-shine', 'Reliable commuter bike with excellent mileage', 85000, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500', 10, true),
('Yamaha R15 V4', 'yamaha-r15-v4', 'Sports bike with racing DNA', 180000, 'https://images.unsplash.com/photo-1558617048-fcd79c2cd723?w=500', 6, true),
('TVS Apache RTR 160', 'tvs-apache-rtr-160', 'Stylish bike with sporty performance', 120000, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', 7, true),
('Bajaj Pulsar NS200', 'bajaj-pulsar-ns200', 'Naked sports bike with aggressive styling', 150000, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500', 5, true),

-- Accessories
('Premium Car Seat Covers', 'premium-car-seat-covers', 'Leather seat covers for enhanced comfort', 8500, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500', 25, true),
('LED Headlight Bulbs', 'led-headlight-bulbs', 'Bright LED headlights for better visibility', 3500, 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=500', 50, true),
('Dashboard Camera', 'dashboard-camera', 'Full HD dash cam with night vision', 12000, 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=500', 30, true),
('Car Floor Mats', 'car-floor-mats', 'Waterproof floor mats for all weather', 2500, 'https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?w=500', 40, true),
('Bike Security Alarm', 'bike-security-alarm', 'Anti-theft alarm system for motorcycles', 4500, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500', 20, true);

-- Now update the additional columns for cars
UPDATE public.products SET 
  category = 'car',
  type = CASE 
    WHEN name LIKE '%Swift%' THEN 'hatchback'
    WHEN name LIKE '%City%' THEN 'sedan' 
    WHEN name LIKE '%Nexon%' OR name LIKE '%Creta%' OR name LIKE '%Thar%' THEN 'suv'
  END,
  brand = CASE 
    WHEN name LIKE '%Maruti%' THEN 'Maruti Suzuki'
    WHEN name LIKE '%Honda City%' THEN 'Honda'
    WHEN name LIKE '%Tata%' THEN 'Tata'
    WHEN name LIKE '%Hyundai%' THEN 'Hyundai'
    WHEN name LIKE '%Mahindra%' THEN 'Mahindra'
  END,
  model = CASE 
    WHEN name LIKE '%Swift%' THEN 'Swift'
    WHEN name LIKE '%City%' THEN 'City'
    WHEN name LIKE '%Nexon%' THEN 'Nexon'
    WHEN name LIKE '%Creta%' THEN 'Creta'
    WHEN name LIKE '%Thar%' THEN 'Thar'
  END,
  year = 2023,
  fuel = CASE 
    WHEN name LIKE '%City%' OR name LIKE '%Swift%' OR name LIKE '%Nexon%' THEN 'Petrol'
    WHEN name LIKE '%Creta%' OR name LIKE '%Thar%' THEN 'Diesel'
  END,
  transmission = CASE 
    WHEN name LIKE '%City%' OR name LIKE '%Creta%' THEN 'Automatic'
    ELSE 'Manual'
  END,
  location = CASE 
    WHEN name LIKE '%Swift%' THEN 'Delhi'
    WHEN name LIKE '%City%' THEN 'Mumbai'
    WHEN name LIKE '%Nexon%' THEN 'Bangalore'
    WHEN name LIKE '%Creta%' THEN 'Chennai'
    WHEN name LIKE '%Thar%' THEN 'Pune'
  END,
  featured = CASE 
    WHEN name LIKE '%Swift%' OR name LIKE '%City%' OR name LIKE '%Creta%' THEN true
    ELSE false
  END
WHERE name IN ('Maruti Suzuki Swift', 'Honda City', 'Tata Nexon', 'Hyundai Creta', 'Mahindra Thar');

-- Update bikes
UPDATE public.products SET 
  category = 'bike',
  type = CASE 
    WHEN name LIKE '%Classic%' THEN 'cruiser'
    WHEN name LIKE '%Shine%' THEN 'commuter'
    WHEN name LIKE '%R15%' OR name LIKE '%Apache%' OR name LIKE '%Pulsar%' THEN 'sports'
  END,
  brand = CASE 
    WHEN name LIKE '%Royal Enfield%' THEN 'Royal Enfield'
    WHEN name LIKE '%Honda%' THEN 'Honda'
    WHEN name LIKE '%Yamaha%' THEN 'Yamaha'
    WHEN name LIKE '%TVS%' THEN 'TVS'
    WHEN name LIKE '%Bajaj%' THEN 'Bajaj'
  END,
  model = CASE 
    WHEN name LIKE '%Classic%' THEN 'Classic 350'
    WHEN name LIKE '%Shine%' THEN 'CB Shine'
    WHEN name LIKE '%R15%' THEN 'R15 V4'
    WHEN name LIKE '%Apache%' THEN 'Apache RTR 160'
    WHEN name LIKE '%Pulsar%' THEN 'Pulsar NS200'
  END,
  year = 2023,
  fuel = 'Petrol',
  transmission = 'Manual',
  location = CASE 
    WHEN name LIKE '%Classic%' THEN 'Delhi'
    WHEN name LIKE '%Shine%' THEN 'Mumbai'
    WHEN name LIKE '%R15%' THEN 'Bangalore'
    WHEN name LIKE '%Apache%' THEN 'Chennai'
    WHEN name LIKE '%Pulsar%' THEN 'Pune'
  END,
  featured = CASE 
    WHEN name LIKE '%Classic%' OR name LIKE '%R15%' OR name LIKE '%Pulsar%' THEN true
    ELSE false
  END
WHERE category = 'bike' OR name LIKE '%Royal Enfield%' OR name LIKE '%Honda CB%' OR name LIKE '%Yamaha%' OR name LIKE '%TVS%' OR name LIKE '%Bajaj%';

-- Update accessories
UPDATE public.products SET 
  category = 'accessory',
  type = CASE 
    WHEN name LIKE '%Seat Covers%' OR name LIKE '%Floor Mats%' THEN 'interior'
    WHEN name LIKE '%Headlight%' THEN 'exterior'
    WHEN name LIKE '%Camera%' THEN 'electronics'
    WHEN name LIKE '%Alarm%' THEN 'security'
  END,
  brand = 'Generic',
  location = 'Pan India',
  featured = CASE 
    WHEN name LIKE '%Seat Covers%' OR name LIKE '%Camera%' OR name LIKE '%Alarm%' THEN true
    ELSE false
  END
WHERE name IN ('Premium Car Seat Covers', 'LED Headlight Bulbs', 'Dashboard Camera', 'Car Floor Mats', 'Bike Security Alarm');
