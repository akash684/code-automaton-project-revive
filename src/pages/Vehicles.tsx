import { useQuery } from "@tanstack/react-query";
import {
  fetchVehicles,
  fetchVehicleBrands,
  fetchVehicleFuelTypes,
  fetchVehicleTransmissions
} from "@/services/supabase/products";
import { VehicleCard } from "@/components/ui/vehicle-card";
import { FilterPanel } from "@/components/ui/filter-panel";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useState } from "react";

const DEFAULT_PRICE_RANGE: [number, number] = [50000, 2000000];

export default function Vehicles() {
  const [filters, setFilters] = useState({
    brand: "",
    fuel: "",
    transmission: "",
    priceRange: DEFAULT_PRICE_RANGE as [number, number],
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");

  // Fetch dynamic filters
  const brandsQuery = useQuery<string[]>({ queryKey: ["vehicle-brands"], queryFn: fetchVehicleBrands });
  const fuelQuery = useQuery<string[]>({ queryKey: ["vehicle-fuels"], queryFn: fetchVehicleFuelTypes });
  const transQuery = useQuery<string[]>({ queryKey: ["vehicle-transmissions"], queryFn: fetchVehicleTransmissions });

  // Main fetch
  const vehiclesQuery = useQuery({
    queryKey: [
      "vehicles",
      filters,
      search,
      sort
    ],
    queryFn: () =>
      fetchVehicles({
        ...filters,
        priceRange: filters.priceRange,
        search,
        sort: sort as "price-asc" | "price-desc",
      })
  });

  const handleReset = () => {
    setFilters({
      brand: "",
      fuel: "",
      transmission: "",
      priceRange: DEFAULT_PRICE_RANGE,
    });
    setSearch("");
    setSort("price-asc");
  };

  return (
    <div className="bg-bg-secondary min-h-screen">
      <main className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64 mb-4 shrink-0">
            <FilterPanel
              brands={brandsQuery.data ?? []}
              filters={filters}
              onChange={setFilters}
              minPrice={DEFAULT_PRICE_RANGE[0]}
              maxPrice={DEFAULT_PRICE_RANGE[1]}
              fuelTypes={fuelQuery.data ?? []}
              transmissionTypes={transQuery.data ?? []}
            />
          </aside>
          {/* Main content */}
          <section className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4">
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search vehicles…"
                className="md:max-w-xs"
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
            {/* Loading */}
            {vehiclesQuery.isLoading ? (
              <div className="py-32 text-center text-gray-500 animate-pulse">Loading...</div>
            ) : vehiclesQuery.isError ? (
              <div className="py-32 text-center text-red-500">Error loading vehicles.</div>
            ) : vehiclesQuery.data?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {vehiclesQuery.data.map((vehicle: any) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-32 text-gray-500">
                <img src="/placeholder.svg" alt="" className="w-16 h-16 mb-2 opacity-40" />
                <div className="text-xl font-medium">No results found</div>
                <button className="text-blue-700 mt-3" onClick={handleReset}>
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
