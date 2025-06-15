
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

// Fetch detailed product data for a list of product_ids
export function useWishlistProductDetails(productId: number | null | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!!productId);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select("*")
        .eq("id", productId)
        .limit(1)
        .single();
      if (error) {
        setProduct(null);
      } else {
        setProduct(data as Product);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  return { product, loading };
}
