
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { AnimatedEmpty } from "@/components/ui/animated-empty";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DEFAULT_PRICE_RANGE } from "@/constants/price";
import type { Database } from "@/integrations/supabase/types";

// Correct VehicleRow based on your schema
type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];

export default function Vehicles() {
  // Filters and price range state
  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    fuel: "all",
    transmission: "all",
  });
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");

  // --- Fetch logic for vehicles from the "vehicles" table ---
  const vehiclesQuery = useQuery({
    queryKey: ["vehicles", filters, search, sort, priceRange],
    queryFn: async (): Promise<VehicleRow[]> => {
      const { supabase } = await import("@/integrations/supabase/client");

      // Normalize filters for the DB
      const catFilter = filters.category === "all" ? null : filters.category.toLowerCase().trim();
      const brandFilter = filters.brand === "all" ? null : filters.brand.toLowerCase().trim();
      const fuelFilter = filters.fuel === "all" ? null : filters.fuel.toLowerCase().trim();
      const transFilter = filters.transmission === "all" ? null : filters.transmission.toLowerCase().trim();

      // Correct: from<T, R>(table: string)
      let query = supabase.from<VehicleRow, VehicleRow>("vehicles").select("*");

      if (catFilter) {
        query = query.eq("category", catFilter);
      } else {
        // Note: category value is a string on schema, so use an array of strings
        query = query.in("category", ["car", "bike"]);
      }

      if (search) query = query.ilike("model", `%${search}%`);
      if (sort === "price-asc") {
        query = query.order("price", { ascending: true });
      } else if (sort === "price-desc") {
        query = query.order("price", { ascending: false });
      }

      if (brandFilter) query = query.eq("brand", brandFilter);
      if (fuelFilter) query = query.eq("fuel", fuelFilter);
      if (transFilter) query = query.eq("transmission", transFilter);

      // Apply price range only if not at defaults
      if (
        priceRange &&
        (priceRange[0] !== DEFAULT_PRICE_RANGE[0] || priceRange[1] !== DEFAULT_PRICE_RANGE[1])
      ) {
        query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Failed to fetch vehicles:", error.message);
        toast.error("Failed to load vehicles!");
        return [];
      }
      if (!data || data.length === 0) {
        toast.info("No cars or bikes found. Check filters or Supabase policy.");
      }

      return data ?? [];
    },
  });

  // Reset all filters
  const handleReset = () => {
    setFilters({
      category: "all",
      brand: "all",
      fuel: "all",
      transmission: "all",
    });
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSearch("");
    setSort("price-asc");
  };

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
                    brand: e.target.value.trim() || "all",
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
                    fuel: e.target.value.trim() || "all",
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
                    transmission: e.target.value.trim() || "all",
                  }))}
                />
              </div>
              {/* Price with Sliders */}
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
// ... end of file
