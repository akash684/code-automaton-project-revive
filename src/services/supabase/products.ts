
import { supabase } from "@/integrations/supabase/client";

// --- VEHICLES --- //

// All vehicles have type 'car' or 'bike' in the products table

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
  let query = supabase
    .from("products")
    .select("*")
    .or("type.eq.car,type.eq.bike");

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
  return (data ?? []).filter(
    (item: any) => item.type === "car" || item.type === "bike"
  );
}

export async function fetchVehicleBrands(): Promise<string[]> {
  const { data, error } = await supabase
    .from("products")
    .select("brand, type")
    .or("type.eq.car,type.eq.bike");
  if (error) throw error;
  return Array.from(
    new Set((data ?? [])
      .filter((v: any) => v.type === "car" || v.type === "bike")
      .map((v: any) => v.brand)
      .filter(Boolean))
  ) as string[];
}

export async function fetchVehicleFuelTypes(): Promise<string[]> {
  const { data, error } = await supabase
    .from("products")
    .select("fuel, type")
    .or("type.eq.car,type.eq.bike");
  if (error) throw error;
  return Array.from(
    new Set((data ?? [])
      .filter((v: any) => v.type === "car" || v.type === "bike")
      .map((v: any) => v.fuel)
      .filter(Boolean))
  ) as string[];
}

export async function fetchVehicleTransmissions(): Promise<string[]> {
  const { data, error } = await supabase
    .from("products")
    .select("transmission, type")
    .or("type.eq.car,type.eq.bike");
  if (error) throw error;
  return Array.from(
    new Set((data ?? [])
      .filter((v: any) => v.type === "car" || v.type === "bike")
      .map((v: any) => v.transmission)
      .filter(Boolean))
  ) as string[];
}

// --- ACCESSORIES --- //

// All accessories have type 'accessory' in the products table

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
  let query = supabase.from("products").select("*").eq("type", "accessory");

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
  return (data ?? []).filter((item: any) => item.type === "accessory");
}

export async function fetchAccessoryBrands(): Promise<string[]> {
  const { data, error } = await supabase
    .from("products")
    .select("brand, type")
    .eq("type", "accessory");
  if (error) throw error;
  return Array.from(
    new Set((data ?? [])
      .filter((a: any) => a.type === "accessory")
      .map((a: any) => a.brand)
      .filter(Boolean))
  ) as string[];
}

export async function fetchAccessoryCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("products")
    .select("category, type")
    .eq("type", "accessory");
  if (error) throw error;
  return Array.from(
    new Set((data ?? [])
      .filter((a: any) => a.type === "accessory")
      .map((a: any) => a.category)
      .filter(Boolean))
  ) as string[];
}
