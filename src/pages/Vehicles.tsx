import { useQuery } from "@tanstack/react-query";
import { fetchVehicles, fetchVehicleBrands } from "@/services/supabase/products";
import { VehicleCard } from "@/components/ui/vehicle-card";
import { FilterPanel } from "@/components/ui/filter-panel";
import { SearchBar } from "@/components/ui/search-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import FiltersPanel, { Filters } from '@/components/FiltersPanel';
import { toast } from 'sonner';

const fuelTypes = ["Petrol", "Diesel", "Electric", "CNG"];
const transmissionTypes = ["Manual", "Automatic"];

export default function Vehicles() {
  const [filters, setFilters] = useState({
    brand: "",
    fuel: "",
    transmission: "",
    priceRange: [50000, 2000000] as [number, number],
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");

  const brandsQuery = useQuery({
    queryKey: ["vehicle-brands"],
    queryFn: fetchVehicleBrands,
  });

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
        sort,
      }),
    keepPreviousData: true,
  });

  const handleReset = () => {
    setFilters({
      brand: "",
      fuel: "",
      transmission: "",
      priceRange: [50000, 2000000],
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
              brands={brandsQuery.data || []}
              filters={filters}
              onChange={setFilters}
              minPrice={50000}
              maxPrice={2000000}
              fuelTypes={fuelTypes}
              transmissionTypes={transmissionTypes}
            />
          </aside>
          {/* Main content */}
          <section className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4">
              <SearchBar value={search} onChange={setSearch} placeholder="Search vehicles..." />
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
            ) : vehiclesQuery.data?.data?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {vehiclesQuery.data.data.map((vehicle: any) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={handleReset} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
