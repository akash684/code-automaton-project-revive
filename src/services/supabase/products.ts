
import { supabase } from "@/integrations/supabase/client";

export async function fetchVehicles({ brand, fuel, priceRange, transmission, search, sort }: {
  brand?: string;
  fuel?: string;
  priceRange?: [number, number];
  transmission?: string;
  search?: string;
  sort?: string;
}) {
  let query = supabase.from("products").select("*", { count: "exact" }).eq("category", "car").or("category.eq.bike");

  if (brand) query = query.eq("brand", brand);
  if (fuel) query = query.eq("fuel", fuel);
  if (transmission) query = query.eq("transmission", transmission);
  if (priceRange) {
    query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);
  }
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  if (sort) {
    if (sort === "price-asc") query = query.order("price", { ascending: true });
    if (sort === "price-desc") query = query.order("price", { ascending: false });
  } else {
    query = query.order("name", { ascending: true });
  }
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

export async function fetchVehicleBrands() {
  const { data, error } = await supabase.from("products").select("brand").neq("brand", null).in("category", ["car", "bike"]);
  if (error) throw error;
  return Array.from(new Set((data || []).map((v: any) => v.brand)));
}

export async function fetchAccessories({ category, brand, priceRange, search, sort }: {
  category?: string;
  brand?: string;
  priceRange?: [number, number];
  search?: string;
  sort?: string;
}) {
  let query = supabase.from("products").select("*", { count: "exact" }).eq("category", "accessory");

  if (category) query = query.eq("type", category);
  if (brand) query = query.eq("brand", brand);
  if (priceRange) {
    query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);
  }
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  if (sort) {
    if (sort === "price-asc") query = query.order("price", { ascending: true });
    if (sort === "price-desc") query = query.order("price", { ascending: false });
  } else {
    query = query.order("name", { ascending: true });
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

export async function fetchAccessoryBrands() {
  const { data, error } = await supabase.from("products").select("brand").neq("brand", null).eq("category", "accessory");
  if (error) throw error;
  return Array.from(new Set((data || []).map((a: any) => a.brand)));
}

export async function fetchAccessoryCategories() {
  const { data, error } = await supabase.from("products").select("type").neq("type", null).eq("category", "accessory");
  if (error) throw error;
  return Array.from(new Set((data || []).map((a: any) => a.type)));
}
