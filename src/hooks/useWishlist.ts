import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WishlistItem as WishlistItemType } from "@/types";
import { toast } from 'sonner';

type ItemType = 'product' | 'vehicle' | 'accessory';

// Fallback fetcher for missing joined product
const fetchProductFallback = async (item_type: ItemType, uuidOrId: string | number) => {
  if (item_type === "vehicle") {
    const { data } = await supabase.from("vehicles").select("*").eq("id", String(uuidOrId)).maybeSingle();
    return data
      ? { name: `${data.brand} ${data.model}`, price: Number(data.price), image_url: data.image_url ?? "", in_stock: !!data.available, ...data }
      : null;
  }
  if (item_type === "accessory") {
    const { data } = await supabase.from("accessories").select("*").eq("id", String(uuidOrId)).maybeSingle();
    return data
      ? { name: data.name, price: Number(data.price), image_url: data.image_url ?? "", in_stock: !!data.available, ...data }
      : null;
  }
  if (item_type === "product") {
    const { data } = await supabase.from("products").select("*").eq("id", Number(uuidOrId)).maybeSingle();
    return data
      ? { name: data.name, price: Number(data.price), image_url: data.image_url ?? "", in_stock: !!data.in_stock, ...data }
      : null;
  }
  return null;
};

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      // Correct join/aliases for WishlistItem unification
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          *,
          products:products(*),
          vehicles:vehicles(*),
          accessories:accessories(*)
        `)
        .eq("user_id", String(user.id)); // ensure user_id is a string

      if (error) throw error;

      const mapped: WishlistItemType[] = await Promise.all(
        (data || []).map(async (row: any) => {
          let type: "product" | "vehicle" | "accessory" = row.item_type;
          let baseProduct: WishlistItemType["product"] = null;
          if (type === "product" && row.products) {
            baseProduct = {
              name: row.products.name,
              price: Number(row.products.price),
              image_url: row.products.image_url ?? "",
              in_stock: !!row.products.in_stock,
              ...row.products,
            };
          } else if (type === "vehicle" && row.vehicles) {
            baseProduct = {
              name: `${row.vehicles.brand} ${row.vehicles.model}`,
              price: Number(row.vehicles.price),
              image_url: row.vehicles.image_url ?? "",
              in_stock: !!row.vehicles.available,
              ...row.vehicles,
            };
          } else if (type === "accessory" && row.accessories) {
            baseProduct = {
              name: row.accessories.name,
              price: Number(row.accessories.price),
              image_url: row.accessories.image_url ?? "",
              in_stock: !!row.accessories.available,
              ...row.accessories,
            };
          } else {
            // fallback
            baseProduct = await fetchProductFallback(
              type,
              type === "product" ? Number(row.product_id) : String(row.item_uuid)
            );
          }
          return {
            id: String(row.id),
            user_id: String(row.user_id),
            item_type: type,
            item_uuid: String(row.item_uuid),
            product_id: Number(row.product_id),
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

  // Fix addToWishlist/removeFromWishlist types, allow string/number, cast when needed:
  const addToWishlist = async (itemId: number | string) => {
    const itemType: "product" | "vehicle" | "accessory" =
      typeof itemId === 'number'
        ? "product"
        : typeof itemId === 'string' && itemId.length === 36
        ? "vehicle"
        : "accessory";
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to add items to wishlist');
        return false;
      }
      if (isInWishlist(itemId)) {
        toast.info('Item already in wishlist');
        return false;
      }
      // For Partial<WishlistItem> & {user_id}, casting is now correct
      const insertData: Partial<WishlistItemType> & { user_id?: string } = {
        user_id: String(user.id),
        item_type: itemType,
      };
      if (itemType === 'product' && typeof itemId === 'number') {
        insertData.product_id = Number(itemId);
      } else if ((itemType === 'vehicle' || itemType === 'accessory') && typeof itemId === 'string') {
        insertData.item_uuid = String(itemId);
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

  const removeFromWishlist = async (itemId: number | string) => {
    const itemType: "product" | "vehicle" | "accessory" =
      typeof itemId === 'number'
        ? "product"
        : typeof itemId === 'string' && itemId.length === 36
        ? "vehicle"
        : "accessory";
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      let query = supabase.from('wishlist').delete().eq('user_id', String(user.id)).eq('item_type', itemType);
      if (itemType === 'product' && typeof itemId === 'number') {
        query = query.eq('product_id', Number(itemId));
      } else if ((itemType === 'vehicle' || itemType === 'accessory') && typeof itemId === 'string') {
        query = query.eq('item_uuid', String(itemId));
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

  const isInWishlist = (itemId: number | string) => {
    const itemType: "product" | "vehicle" | "accessory" =
      typeof itemId === 'number'
        ? "product"
        : typeof itemId === 'string' && itemId.length === 36
        ? "vehicle"
        : "accessory";

    if (itemType === 'product' && typeof itemId === 'number') {
      return wishlistItems.some(item => item.product_id === Number(itemId) && item.item_type === 'product');
    }
    if ((itemType === 'vehicle' || itemType === 'accessory') && typeof itemId === 'string') {
      return wishlistItems.some(item => item.item_uuid === String(itemId) && item.item_type === itemType);
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
