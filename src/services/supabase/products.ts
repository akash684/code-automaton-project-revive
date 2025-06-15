
import { supabase } from "@/integrations/supabase/client";

// --- VEHICLES --- //

// Fetch all vehicles
export async function fetchVehicles({
  brand,
  fuel,
  transmission,
  priceRange,
  search,
  sort,
}: {
  brand?: string;
  fuel?: string;
  transmission?: string;
  priceRange?: [number, number];
  search?: string;
  sort?: "price-asc" | "price-desc";
}) {
  let query = supabase.from("vehicles").select("*");

  if (brand) query = query.eq("brand", brand);
  if (fuel) query = query.eq("fuel", fuel);
  if (transmission) query = query.eq("transmission", transmission);
  if (priceRange) {
    query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);
  }
  if (search) query = query.ilike("name", `%${search}%`);
  if (sort) {
    if (sort === "price-asc") query = query.order("price", { ascending: true });
    if (sort === "price-desc") query = query.order("price", { ascending: false });
  } else {
    query = query.order("name", { ascending: true });
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchVehicleBrands(): Promise<string[]> {
  const { data, error } = await supabase.from("vehicles").select("brand");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((v: any) => v.brand).filter(Boolean))) as string[];
}

export async function fetchVehicleFuelTypes(): Promise<string[]> {
  const { data, error } = await supabase.from("vehicles").select("fuel");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((v: any) => v.fuel).filter(Boolean))) as string[];
}

export async function fetchVehicleTransmissions(): Promise<string[]> {
  const { data, error } = await supabase.from("vehicles").select("transmission");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((v: any) => v.transmission).filter(Boolean))) as string[];
}

// --- ACCESSORIES --- //

export async function fetchAccessories({
  brand,
  category,
  priceRange,
  search,
  sort,
}: {
  brand?: string;
  category?: string;
  priceRange?: [number, number];
  search?: string;
  sort?: "price-asc" | "price-desc";
}) {
  let query = supabase.from("accessories").select("*");

  if (brand) query = query.eq("brand", brand);
  if (category) query = query.eq("category", category);
  if (priceRange) {
    query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);
  }
  if (search) query = query.ilike("name", `%${search}%`);
  if (sort) {
    if (sort === "price-asc") query = query.order("price", { ascending: true });
    if (sort === "price-desc") query = query.order("price", { ascending: false });
  } else {
    query = query.order("name", { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchAccessoryBrands(): Promise<string[]> {
  const { data, error } = await supabase.from("accessories").select("brand");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((a: any) => a.brand).filter(Boolean))) as string[];
}

export async function fetchAccessoryCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("accessories").select("category");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((a: any) => a.category).filter(Boolean))) as string[];
}
