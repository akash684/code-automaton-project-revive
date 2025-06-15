
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

  // --- Buy Modal State ---
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string; price: number; image_url: string } | null>(null);

  // --- Fetch logic for vehicles from the "vehicles" table ---
  const vehiclesQuery = useQuery({
    queryKey: ["vehicles", filters, search, sort, priceRange],
    queryFn: async (): Promise<Vehicle[]> => {
      const { supabase } = await import("@/integrations/supabase/client");

      // Normalize filters for the DB
      const catFilter = filters.category !== "all" && filters.category !== "" ? filters.category.trim() : null;
      const brandFilter = filters.brand !== "all" && filters.brand !== "" ? filters.brand.trim() : null;
      const fuelFilter = filters.fuel !== "all" && filters.fuel !== "" ? filters.fuel.trim() : null;
      const transFilter = filters.transmission !== "all" && filters.transmission !== "" ? filters.transmission.trim() : null;

      let query = supabase.from("vehicles").select("*");

      if (catFilter) query = query.eq("category", catFilter);
      if (brandFilter) query = query.eq("brand", brandFilter);
      if (fuelFilter) query = query.eq("fuel", fuelFilter);
      if (transFilter) query = query.eq("transmission", transFilter);

      if (search) query = query.ilike("model", `%${search}%`);
      if (sort === "price-asc") query = query.order("price", { ascending: true });
      else if (sort === "price-desc") query = query.order("price", { ascending: false });

      // Apply price range filter if different from default
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
        toast.info("No cars or bikes found. Check filters or Supabase policy.");
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

  // Helpers for cleaner UI logic
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? "all" : value,
    }));
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-72 mb-4 shrink-0">
            {/* Vehicle Type */}
            <div>
              <div className="font-medium mb-1">Type</div>
              <Select
                value={filters.category}
                onValueChange={v => handleFilterChange("category", v)}
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
                onChange={e => handleFilterChange("brand", e.target.value)}
              />
            </div>
            {/* Fuel */}
            <div>
              <div className="font-medium mb-1">Fuel</div>
              <Input
                value={filters.fuel === "all" ? "" : filters.fuel}
                placeholder="All Fuels"
                onChange={e => handleFilterChange("fuel", e.target.value)}
              />
            </div>
            {/* Transmission */}
            <div>
              <div className="font-medium mb-1">Transmission</div>
              <Input
                value={filters.transmission === "all" ? "" : filters.transmission}
                placeholder="All Transmissions"
                onChange={e => handleFilterChange("transmission", e.target.value)}
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
