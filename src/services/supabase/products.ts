
// --- VEHICLES (uses vehicles table) --- //

import { supabase } from "@/integrations/supabase/client";

// Fetch vehicles list (with filters)
export async function fetchVehicles({
  category,
  brand,
  fuel,
  transmission,
  priceRange,
  search,
  sort,
}: {
  category?: "car" | "bike" | ""; // added
  brand?: string;
  fuel?: string;
  transmission?: string;
  priceRange?: [number, number];
  search?: string;
  sort?: "price-asc" | "price-desc";
}) {
  let query = supabase.from("vehicles").select("*");

  if (category) query = query.eq("category", category);
  if (brand) query = query.eq("brand", brand);
  if (fuel) query = query.eq("fuel", fuel);
  if (transmission) query = query.eq("transmission", transmission);
  if (priceRange) {
    query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);
  }
  if (search) query = query.ilike("model", `%${search}%`);
  if (sort) {
    if (sort === "price-asc") query = query.order("price", { ascending: true });
    if (sort === "price-desc") query = query.order("price", { ascending: false });
  } else {
    query = query.order("model", { ascending: true });
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchVehicleBrands(): Promise<string[]> {
  const { data, error } = await supabase.from("vehicles").select("brand");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((v: any) => v.brand).filter(Boolean)));
}

export async function fetchVehicleFuelTypes(): Promise<string[]> {
  const { data, error } = await supabase.from("vehicles").select("fuel");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((v: any) => v.fuel).filter(Boolean)));
}

export async function fetchVehicleTransmissions(): Promise<string[]> {
  const { data, error } = await supabase.from("vehicles").select("transmission");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((v: any) => v.transmission).filter(Boolean)));
}

// --- ACCESSORIES (uses accessories table) --- //

export async function fetchAccessories({
  category,
  compatibleVehicleType,
  inStock,
  search,
  sort,
}: {
  category?: string;
  compatibleVehicleType?: string;
  inStock?: boolean;
  search?: string;
  sort?: "price-asc" | "price-desc";
}) {
  let query = supabase.from("accessories").select("*");
  if (category) query = query.eq("category", category);
  if (compatibleVehicleType) query = query.contains("compatible_vehicle_types", [compatibleVehicleType]);
  if (typeof inStock === "boolean") query = query.eq("available", inStock);
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

export async function fetchAccessoryCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("accessories").select("category");
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((a: any) => a.category).filter(Boolean)));
}
