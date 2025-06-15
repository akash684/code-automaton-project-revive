
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WishlistItem } from '@/types';
import { toast } from 'sonner';

function isIntegerId(id: any): id is number {
  return typeof id === 'number' && Number.isInteger(id);
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
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (itemId: number | string) => {
    // Only allow adding integer (legacy 'product') ids, for now
    if (!isIntegerId(itemId)) {
      toast.info(
        'Favoriting is currently only supported for products. Accessories and vehicles cannot be added to wishlist yet.'
      );
      return false;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to add items to wishlist');
        return false;
      }

      // Check if item already exists in wishlist
      const existingItem = wishlistItems.find(item => item.product_id === itemId);
      if (existingItem) {
        toast.info('Item already in wishlist');
        return false;
      }

      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: itemId
        });

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

  const removeFromWishlist = async (itemId: number | string) => {
    // Only allow removing integer (product) items for now
    if (!isIntegerId(itemId)) {
      toast.info(
        'Wishlist removal is not supported for this type of item yet.'
      );
      return false;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', itemId);

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

  const isInWishlist = (itemId: number | string) => {
    // Only check for legacy integer ids
    if (!isIntegerId(itemId)) return false;
    return wishlistItems.some(item => item.product_id === itemId);
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

