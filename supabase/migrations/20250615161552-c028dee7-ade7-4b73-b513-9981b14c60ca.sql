
-- Drop the unique constraint on (user_id, product_id)
ALTER TABLE public.wishlist
  DROP CONSTRAINT IF EXISTS wishlist_user_id_product_id_key;

-- Step 1: Add item_type column
ALTER TABLE public.wishlist
  ADD COLUMN IF NOT EXISTS item_type text CHECK (item_type IN ('product', 'vehicle', 'accessory')) DEFAULT 'product';

-- Step 2: Add item_uuid column
ALTER TABLE public.wishlist
  ADD COLUMN IF NOT EXISTS item_uuid uuid;

-- Step 3: Allow product_id to be nullable for non-product items
ALTER TABLE public.wishlist
  ALTER COLUMN product_id DROP NOT NULL;

-- Step 4: Add new unique composite index (user + item_type + product_id/item_uuid)
CREATE UNIQUE INDEX IF NOT EXISTS wishlist_user_item_unique ON public.wishlist (
  user_id, 
  item_type, 
  COALESCE(CAST(product_id AS text), CAST(item_uuid AS text))
)
WHERE user_id IS NOT NULL;

-- Step 5: Add index for quick lookup on UUIDs
CREATE INDEX IF NOT EXISTS wishlist_item_uuid_idx ON public.wishlist(item_uuid);

