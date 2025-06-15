
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { AnimatedEmpty } from "@/components/ui/animated-empty";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DEFAULT_PRICE_RANGE } from "@/constants/price";
import type { Database } from "@/integrations/supabase/types";

// Use your Supabase-generated types:
type VehicleRow = Database['public']['Tables']['vehicles']['Row'];

export default function Vehicles() {
  // Filters and price range state
  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    fuel: "all",
    transmission: "all"
  });
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");

  // --- Fetch logic for vehicles from the "vehicle" table ---
  const vehiclesQuery = useQuery({
    queryKey: ["vehicles", filters, search, sort, priceRange],
    queryFn: async () => {
      const { supabase } = await import("@/integrations/supabase/client");

      // Normalize filters for the DB
      const catFilter = filters.category === "all" ? null : filters.category.toLowerCase().trim();
      const brandFilter = filters.brand === "all" ? null : filters.brand.toLowerCase().trim();
      const fuelFilter = filters.fuel === "all" ? null : filters.fuel.toLowerCase().trim();
      const transFilter = filters.transmission === "all" ? null : filters.transmission.toLowerCase().trim();

      let query = supabase.from<VehicleRow>("vehicles").select("*");

      if (catFilter) {
        query = query.eq("category" as keyof VehicleRow, catFilter);
      } else {
        query = query.in("category" as keyof VehicleRow, ["car", "bike"]);
      }

      if (search) query = query.ilike("model" as keyof VehicleRow, `%${search}%`);
      if (sort === "price-asc") query = query.order("price" as keyof VehicleRow, { ascending: true });
      else if (sort === "price-desc") query = query.order("price" as keyof VehicleRow, { ascending: false });

      if (brandFilter) query = query.eq("brand" as keyof VehicleRow, brandFilter);
      if (fuelFilter) query = query.eq("fuel" as keyof VehicleRow, fuelFilter);
      if (transFilter) query = query.eq("transmission" as keyof VehicleRow, transFilter);

      // Apply price range
      if (
        priceRange &&
        (priceRange[0] !== DEFAULT_PRICE_RANGE[0] || priceRange[1] !== DEFAULT_PRICE_RANGE[1])
      ) {
        query = query
          .gte("price" as keyof VehicleRow, priceRange[0])
          .lte("price" as keyof VehicleRow, priceRange[1]);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Failed to fetch vehicles:", error.message);
        return [];
      }
      if (!data || data.length === 0) {
        toast.info("No cars or bikes found. Check filters or Supabase policy.");
      }

      // You may temporarily use:
      // console.table(data);
      return data ?? [];
    }
  });

  // Reset all filters
  const handleReset = () => {
    setFilters({
      category: "all",
      brand: "all",
      fuel: "all",
      transmission: "all"
    });
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSearch("");
    setSort("price-asc");
  };

  // Rendering UI – main structure simplified for clarity here.
  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-72 mb-4 shrink-0">
            <div className="space-y-6 p-6 rounded-2xl bg-card text-foreground border border-border shadow backdrop-blur-lg">
              {/* Vehicle Type */}
              <div>
                <div className="font-medium mb-1">Type</div>
                <Select
                  value={filters.category}
                  onValueChange={v => setFilters(f => ({ ...f, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Brand */}
              <div>
                <div className="font-medium mb-1">Brand</div>
                <Input
                  value={filters.brand === "all" ? "" : filters.brand}
                  placeholder="All Brands"
                  onChange={e => setFilters(f => ({
                    ...f,
                    brand: e.target.value.trim() || "all"
                  }))}
                />
              </div>
              {/* Fuel */}
              <div>
                <div className="font-medium mb-1">Fuel</div>
                <Input
                  value={filters.fuel === "all" ? "" : filters.fuel}
                  placeholder="All Fuels"
                  onChange={e => setFilters(f => ({
                    ...f,
                    fuel: e.target.value.trim() || "all"
                  }))}
                />
              </div>
              {/* Transmission */}
              <div>
                <div className="font-medium mb-1">Transmission</div>
                <Input
                  value={filters.transmission === "all" ? "" : filters.transmission}
                  placeholder="All Transmissions"
                  onChange={e => setFilters(f => ({
                    ...f,
                    transmission: e.target.value.trim() || "all"
                  }))}
                />
              </div>
              {/* Price with Slider */}
              <div>
                <div className="font-medium mb-1">Price</div>
                <input
                  type="range"
                  min={DEFAULT_PRICE_RANGE[0]}
                  max={DEFAULT_PRICE_RANGE[1]}
                  value={priceRange[0]}
                  onChange={e => setPriceRange(pr => [Number(e.target.value), pr[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min={DEFAULT_PRICE_RANGE[0]}
                  max={DEFAULT_PRICE_RANGE[1]}
                  value={priceRange[1]}
                  onChange={e => setPriceRange(pr => [pr[0], Number(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
              {/* Reset Filters */}
              <Button className="mt-3 w-full" variant="outline" onClick={handleReset}>
                Reset Filters
              </Button>
            </div>
          </aside>
          {/* Main content */}
          <section className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4">
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by Model…"
                className="md:max-w-xs bg-white/80 dark:bg-gray-900/70"
              />
              {/* Sort */}
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Results */}
            {vehiclesQuery.isLoading ? (
              <div className="py-32 text-center text-muted animate-pulse">Loading...</div>
            ) : vehiclesQuery.isError ? (
              <div className="py-32 text-center text-error">Error loading vehicles.</div>
            ) : vehiclesQuery.data?.length ? (
              <div>
                {/* Render your list of vehicles here */}
                {vehiclesQuery.data.map(vehicle => (
                  <div key={vehicle.id} className="p-4 mb-4 rounded-lg border bg-card">
                    <div className="font-bold">{vehicle.brand} {vehicle.model}</div>
                    <div>{vehicle.category}</div>
                    <div>Fuel: {vehicle.fuel}</div>
                    <div>Transmission: {vehicle.transmission}</div>
                    <div>Price: ₹{vehicle.price}</div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatedEmpty message="No vehicles available right now." onReset={handleReset} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
