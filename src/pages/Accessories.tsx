import { useQuery } from "@tanstack/react-query";
import { fetchAccessories, fetchAccessoryBrands, fetchAccessoryCategories } from "@/services/supabase/products";
import { AccessoryCard } from "@/components/ui/accessory-card";
import { FilterPanel } from "@/components/ui/filter-panel";
import { SearchBar } from "@/components/ui/search-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useState } from "react";

export default function Accessories() {
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    priceRange: [500, 20000] as [number, number],
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");

  const brandsQuery = useQuery({
    queryKey: ["accessory-brands"],
    queryFn: fetchAccessoryBrands,
  });

  const categoriesQuery = useQuery({
    queryKey: ["accessory-categories"],
    queryFn: fetchAccessoryCategories,
  });

  const accessoriesQuery = useQuery({
    queryKey: [
      "accessories",
      filters,
      search,
      sort
    ],
    queryFn: () =>
      fetchAccessories({
        ...filters,
        priceRange: filters.priceRange,
        search,
        sort,
      }),
  });

  const handleReset = () => {
    setFilters({
      brand: "",
      category: "",
      priceRange: [500, 20000],
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
              categories={categoriesQuery.data || []}
              filters={filters}
              onChange={setFilters}
              minPrice={500}
              maxPrice={20000}
              withCategory
            />
          </aside>
          {/* Main content */}
          <section className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4">
              <SearchBar value={search} onChange={setSearch} placeholder="Search accessories..." />
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
            {accessoriesQuery.isLoading ? (
              <div className="py-32 text-center text-gray-500 animate-pulse">Loading...</div>
            ) : accessoriesQuery.data?.data?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {accessoriesQuery.data.data.map((accessory: any) => (
                  <AccessoryCard key={accessory.id} accessory={accessory} />
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
