import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WishlistItem as WishlistItemType } from "@/types";
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

export interface WishlistItem {
  id: string;
  item_type: "product" | "vehicle" | "accessory";
  item_uuid: string | null;
  product_id?: number | null;
  created_at: string;
  product: {
    name: string;
    price: number;
    image_url: string;
    in_stock?: boolean;
    [key: string]: any;
  } | null;
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchProductFallback = async (item_type:string, uuidOrId: string|number) => {
    if (item_type === "vehicle") {
      const { data } = await supabase.from("vehicles").select("*").eq("id", uuidOrId).maybeSingle();
      return data
        ? { name: `${data.brand} ${data.model}`, price: Number(data.price), image_url: data.image_url ?? "", ...data }
        : null;
    }
    if (item_type === "accessory") {
      const { data } = await supabase.from("accessories").select("*").eq("id", uuidOrId).maybeSingle();
      return data
        ? { name: data.name, price: Number(data.price), image_url: data.image_url ?? "", ...data }
        : null;
    }
    if (item_type === "product") {
      const { data } = await supabase.from("products").select("*").eq("id", uuidOrId).maybeSingle();
      return data
        ? { name: data.name, price: Number(data.price), image_url: data.image_url ?? "", ...data }
        : null;
    }
    return null;
  };

  const fetchWishlistItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }
      // Join all possible product types via supabase cross-table join
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          *,
          products:products(*),
          vehicles:vehicles(*),
          accessories:accessories(*)
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      // Normalize: always product { name, price, img } for any item_type
      const mapped: WishlistItem[] = await Promise.all(
        (data || []).map(async (row: any) => {
          let type: "product" | "vehicle" | "accessory" =
            row.item_type === "vehicle"
              ? "vehicle"
              : row.item_type === "accessory"
              ? "accessory"
              : "product";
          
          let baseProduct = null;
          if (type === "product" && row.products) {
            baseProduct = {
              name: row.products.name,
              price: Number(row.products.price),
              image_url: row.products.image_url ?? "",
              in_stock: row.products.in_stock,
              ...row.products,
            };
          } else if (type === "vehicle" && row.vehicles) {
            baseProduct = {
              name: `${row.vehicles.brand} ${row.vehicles.model}`,
              price: Number(row.vehicles.price),
              image_url: row.vehicles.image_url ?? "",
              in_stock: row.vehicles.available,
              ...row.vehicles,
            };
          } else if (type === "accessory" && row.accessories) {
            baseProduct = {
              name: row.accessories.name,
              price: Number(row.accessories.price),
              image_url: row.accessories.image_url ?? "",
              in_stock: row.accessories.available,
              ...row.accessories,
            };
          } else {
            // Fallback
            const fallback = await fetchProductFallback(
              type,
              type === "product"
                ? row.product_id
                : row.item_uuid
            );
            baseProduct = fallback;
          }
          return {
            id: row.id,
            item_type: type,
            item_uuid: row.item_uuid,
            product_id: row.product_id,
            created_at: row.created_at,
            product: baseProduct,
          };
        })
      );

      setWishlistItems(mapped);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistItems([]);
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
