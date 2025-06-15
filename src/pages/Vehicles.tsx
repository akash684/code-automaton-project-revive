
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { AnimatedEmpty } from "@/components/ui/animated-empty";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DEFAULT_PRICE_RANGE } from "@/constants/price";
import type { Database } from "@/integrations/supabase/types";
import { Vehicle } from "@/types/supabase";
import { VehicleCard } from "@/components/ui/vehicle-card";
import BuyModal from "@/components/BuyModal";

// Correct VehicleRow based on your schema
type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];

// Helper: Brand, Fuel, Transmission options fetching
const useDistinctValues = (column: string) => {
  return useQuery({
    queryKey: ["vehicles", column],
    queryFn: async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.from("vehicles").select(column);
      if (error) return [];
      const vals = (data ?? [])
        .map((row: any) => row[column])
        .filter(Boolean)
        .map((val: string) => val.trim());
      return Array.from(new Set(vals));
    },
  });
};

export default function Vehicles() {
  // Filters and price range state
  const [filters, setFilters] = useState({
    category: "all",         // Type: car | bike | all
    brand: "all",            // Brand (from DB)
    fuel: "all",             // Fuel type (from DB)
    transmission: "all",     // Transmission type (from DB)
  });
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");

  // --- Buy Modal State ---
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string; price: number; image_url: string } | null>(null);

  // Fetch distinct filter options from vehicles
  const brandOptionsQuery = useDistinctValues("brand");
  const fuelOptionsQuery = useDistinctValues("fuel");
  const transmissionOptionsQuery = useDistinctValues("transmission");

  // --- Fetch logic for vehicles from the "vehicles" table ---
  const vehiclesQuery = useQuery({
    queryKey: ["vehicles", filters, search, sort, priceRange],
    queryFn: async (): Promise<Vehicle[]> => {
      const { supabase } = await import("@/integrations/supabase/client");

      // Normalize filters for DB
      const catFilter = filters.category !== "all" ? filters.category : null;
      const brandFilter = filters.brand !== "all" ? filters.brand : null;
      const fuelFilter = filters.fuel !== "all" ? filters.fuel : null;
      const transFilter = filters.transmission !== "all" ? filters.transmission : null;

      let query = supabase.from("vehicles").select("*");
      if (catFilter) query = query.eq("category", catFilter);
      if (brandFilter) query = query.eq("brand", brandFilter);
      if (fuelFilter) query = query.eq("fuel", fuelFilter);
      if (transFilter) query = query.eq("transmission", transFilter);

      if (search) query = query.ilike("model", `%${search}%`);
      if (sort === "price-asc") query = query.order("price", { ascending: true });
      else if (sort === "price-desc") query = query.order("price", { ascending: false });

      // Apply price range filter
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
      if (!Array.isArray(data) || !data) {
        toast.info("No vehicles found. Check filters or Supabase policy.");
        return [];
      }
      return data as Vehicle[];
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
            <div className="space-y-6 p-6 rounded-2xl bg-card text-foreground border border-border shadow">
              {/* Type (Category) */}
              <div>
                <div className="font-medium mb-1">Type</div>
                <Select
                  value={filters.category}
                  onValueChange={(v) => setFilters(f => ({ ...f, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem // Use custom styles for selected
                      value="all"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-primary data-[state=checked]:text-white font-semibold"
                    >
                      All Types
                    </SelectItem>
                    <SelectItem
                      value="car"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    >
                      Car
                    </SelectItem>
                    <SelectItem
                      value="bike"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    >
                      Bike
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Brand */}
              <div>
                <div className="font-medium mb-1">Brand</div>
                <Select
                  value={filters.brand}
                  onValueChange={(v) => setFilters(f => ({ ...f, brand: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="all"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    >
                      All Brands
                    </SelectItem>
                    {brandOptionsQuery.data?.map((brand: string) => (
                      <SelectItem
                        key={brand}
                        value={brand}
                        className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-primary data-[state=checked]:text-white"
                      >
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Fuel */}
              <div>
                <div className="font-medium mb-1">Fuel</div>
                <Select
                  value={filters.fuel}
                  onValueChange={(v) => setFilters(f => ({ ...f, fuel: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Fuels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="all"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    >
                      All Fuels
                    </SelectItem>
                    {fuelOptionsQuery.data?.map((fuel: string) => (
                      <SelectItem
                        key={fuel}
                        value={fuel}
                        className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-primary data-[state=checked]:text-white"
                      >
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Transmission */}
              <div>
                <div className="font-medium mb-1">Transmission</div>
                <Select
                  value={filters.transmission}
                  onValueChange={(v) => setFilters(f => ({ ...f, transmission: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Transmissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="all"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    >
                      All Transmissions
                    </SelectItem>
                    {transmissionOptionsQuery.data?.map((tr: string) => (
                      <SelectItem
                        key={tr}
                        value={tr}
                        className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-primary data-[state=checked]:text-white"
                      >
                        {tr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Reset Filters */}
              <Button variant="outline" className="w-full mt-3" onClick={handleReset}>
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
              // vehicle grid/card list
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vehiclesQuery.data.map(vehicle => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onBuy={(item) => {
                      setSelectedItem(item);
                      setBuyModalOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <AnimatedEmpty message="No vehicles available right now." onReset={handleReset} />
            )}
          </section>
        </div>
      </main>
      {/* Buy Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <BuyModal
              open={buyModalOpen}
              onOpenChange={(open) => setBuyModalOpen(open)}
              item={selectedItem}
              itemType="Vehicle"
            />
          </div>
        </div>
      )}
    </div>
  );
}
