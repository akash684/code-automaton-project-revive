// Vehicles Page - fetches from "vehicles" table

import { useQuery } from "@tanstack/react-query";
import {
  fetchVehicles,
  fetchVehicleBrands,
  fetchVehicleFuelTypes,
  fetchVehicleTransmissions
} from "@/services/supabase/products";
import { VehicleCard } from "@/components/ui/vehicle-card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useState } from "react";

const DEFAULT_PRICE_RANGE: [number, number] = [500, 2000000];

export default function Vehicles() {
  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    fuel: "all",
    transmission: "all",
    priceRange: DEFAULT_PRICE_RANGE as [number, number],
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");

  // Dynamic filter options
  const brandsQuery = useQuery<string[]>({ queryKey: ["vehicle-brands"], queryFn: fetchVehicleBrands });
  const fuelQuery = useQuery<string[]>({ queryKey: ["vehicle-fuels"], queryFn: fetchVehicleFuelTypes });
  const transQuery = useQuery<string[]>({ queryKey: ["vehicle-transmissions"], queryFn: fetchVehicleTransmissions });

  // Main fetch, map "all" to undefined for backend
  const vehiclesQuery = useQuery({
    queryKey: [
      "vehicles",
      filters,
      search,
      sort
    ],
    queryFn: () =>
      fetchVehicles({
        category: filters.category === "all" ? undefined : (filters.category as "car" | "bike" | ""),
        brand: filters.brand === "all" ? undefined : filters.brand,
        fuel: filters.fuel === "all" ? undefined : filters.fuel,
        transmission: filters.transmission === "all" ? undefined : filters.transmission,
        priceRange: filters.priceRange,
        search,
        sort: sort as "price-asc" | "price-desc",
      })
  });

  // Reset logic to "all" instead of ""
  const handleReset = () => {
    setFilters({
      category: "all",
      brand: "all",
      fuel: "all",
      transmission: "all",
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
            <div className="space-y-6 p-4 rounded bg-white shadow">
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
                <Select
                  value={filters.brand}
                  onValueChange={v => setFilters(f => ({ ...f, brand: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brandsQuery.data?.map((brand: string) => (
                      <SelectItem key={brand} value={brand}>
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
                  onValueChange={v => setFilters(f => ({ ...f, fuel: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Fuels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fuels</SelectItem>
                    {fuelQuery.data?.map((f: string) => (
                      <SelectItem key={f} value={f}>
                        {f}
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
                  onValueChange={v => setFilters(f => ({ ...f, transmission: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {transQuery.data?.map((t: string) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div>
                <div className="font-medium mb-1">Price</div>
                <input
                  type="range"
                  min={DEFAULT_PRICE_RANGE[0]}
                  max={DEFAULT_PRICE_RANGE[1]}
                  value={filters.priceRange[0]}
                  onChange={e => setFilters(f => ({ ...f, priceRange: [Number(e.target.value), f.priceRange[1]] }))}
                  className="w-full"
                />
                <input
                  type="range"
                  min={DEFAULT_PRICE_RANGE[0]}
                  max={DEFAULT_PRICE_RANGE[1]}
                  value={filters.priceRange[1]}
                  onChange={e => setFilters(f => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value)] }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>₹{filters.priceRange[0]}</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
              </div>

              {/* Reset */}
              <button className="text-blue-700 mt-3 w-full" onClick={handleReset}>
                Reset Filters
              </button>
            </div>
          </aside>
          {/* Main content */}
          <section className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4">
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by Model…"
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
            {/* Loading state */}
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
