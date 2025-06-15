
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WishlistItem } from '@/types';
import { toast } from 'sonner';

type ItemType = 'product' | 'vehicle' | 'accessory';

function detectItemType(itemId: number | string): ItemType {
  if (typeof itemId === 'number' && Number.isInteger(itemId)) return 'product';
  if (typeof itemId === 'string') {
    // IDs from vehicles/accessories are UUIDv4 strings (36 chars)
    return 'vehicle';
  }
  return 'accessory';
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Make sure every row conforms to WishlistItem, especially item_type
      const mapped = (data || []).map((row) => ({
        ...row,
        // explicitly cast item_type to avoid TS errors
        item_type: (row.item_type === "vehicle" || row.item_type === "accessory" || row.item_type === "product")
          ? row.item_type
          : "product",
        product: row.product ?? null,
      })) as WishlistItem[];

      setWishlistItems(mapped);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add any item type to wishlist (product: int, vehicle/accessory: uuid)
   */
  const addToWishlist = async (itemId: number | string) => {
    const itemType: ItemType = detectItemType(itemId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to add items to wishlist');
        return false;
      }
      // Prevent duplicate
      if (isInWishlist(itemId)) {
        toast.info('Item already in wishlist');
        return false;
      }

      const insertData: Partial<WishlistItem> = {
        user_id: user.id,
        item_type: itemType,
      };
      if (itemType === 'product' && typeof itemId === 'number') {
        insertData.product_id = itemId;
      } else if ((itemType === 'vehicle' || itemType === 'accessory') && typeof itemId === 'string') {
        insertData.item_uuid = itemId;
      } else {
        toast.error('Invalid item type or ID');
        return false;
      }

      const { error } = await supabase
        .from('wishlist')
        .insert(insertData);

      if (error) throw error;
      await fetchWishlistItems();
      toast.success('Item added to wishlist');
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist');
      return false;
    }
  };

  /**
   * Remove any item type from wishlist
   */
  const removeFromWishlist = async (itemId: number | string) => {
    const itemType: ItemType = detectItemType(itemId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      let query = supabase.from('wishlist').delete().eq('user_id', user.id).eq('item_type', itemType);
      if (itemType === 'product' && typeof itemId === 'number') {
        query = query.eq('product_id', itemId);
      } else if ((itemType === 'vehicle' || itemType === 'accessory') && typeof itemId === 'string') {
        query = query.eq('item_uuid', itemId);
      } else {
        toast.error('Invalid item type or ID');
        return false;
      }

      const { error } = await query;

      if (error) throw error;
      await fetchWishlistItems();
      toast.success('Item removed from wishlist');
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
      return false;
    }
  };

  /** Checks if an item is already in wishlist */
  const isInWishlist = (itemId: number | string) => {
    const itemType: ItemType = detectItemType(itemId);
    if (itemType === 'product' && typeof itemId === 'number') {
      return wishlistItems.some(item => item.product_id === itemId && item.item_type === 'product');
    }
    if ((itemType === 'vehicle' || itemType === 'accessory') && typeof itemId === 'string') {
      return wishlistItems.some(item => item.item_uuid === itemId && item.item_type === itemType);
    }
    return false;
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refetch: fetchWishlistItems
  };
};

// ... nothing else changed ...
