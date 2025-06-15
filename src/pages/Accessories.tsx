// Accessories Page - fetches from "accessories" table

import { useQuery } from "@tanstack/react-query";
import {
  fetchAccessories,
  fetchAccessoryCategories,
} from "@/services/supabase/products";
import { AccessoryCard } from "@/components/ui/accessory-card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useState } from "react";

export default function Accessories() {
  const [filters, setFilters] = useState({
    category: "all",
    compatibleVehicleType: "all",
    inStock: "all",
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");

  // Dynamic filters
  const catQuery = useQuery<string[]>({ queryKey: ["accessory-categories"], queryFn: fetchAccessoryCategories });

  // Main fetch, map "all" to undefined
  const accessoriesQuery = useQuery({
    queryKey: [
      "accessories",
      filters,
      search,
      sort
    ],
    queryFn: () =>
      fetchAccessories({
        category: filters.category === "all" ? undefined : filters.category,
        compatibleVehicleType:
          filters.compatibleVehicleType === "all" ? undefined : filters.compatibleVehicleType,
        inStock:
          filters.inStock === "all" ? undefined : filters.inStock === "true",
        search,
        sort: sort as "price-asc" | "price-desc",
      }),
  });

  const handleReset = () => {
    setFilters({
      category: "all",
      compatibleVehicleType: "all",
      inStock: "all",
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
              {/* Category */}
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
                    {/* Highlight styling for Accessories and Vehicles options */}
                    <SelectItem 
                      value="all" 
                      className="flex items-center text-gray-700 font-semibold"
                    >
                      All Types
                    </SelectItem>
                    {/* Example: color for Gear-related types */}
                    {catQuery.data?.map((cat: string) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className={
                          cat.toLowerCase().includes('helmet')
                            ? "flex items-center text-blue-700 font-bold"
                            : cat.toLowerCase().includes('gloves')
                              ? "flex items-center text-green-700"
                              : cat.toLowerCase().includes('jackets')
                                ? "flex items-center text-pink-700"
                                : cat.toLowerCase().includes('mobile')
                                  ? "flex items-center text-teal-700"
                                  : cat.toLowerCase().includes('gps')
                                    ? "flex items-center text-yellow-700"
                                    : "flex items-center"
                        }
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Compatible Vehicle */}
              <div>
                <div className="font-medium mb-1">Compatible For</div>
                <Select
                  value={filters.compatibleVehicleType}
                  onValueChange={v =>
                    setFilters(f => ({ ...f, compatibleVehicleType: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Vehicles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Stock */}
              <div>
                <div className="font-medium mb-1">Stock Status</div>
                <Select
                  value={filters.inStock}
                  onValueChange={v => setFilters(f => ({ ...f, inStock: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">In Stock</SelectItem>
                    <SelectItem value="false">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
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
                placeholder="Search accessories…"
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
            {accessoriesQuery.isLoading ? (
              <div className="py-32 text-center text-gray-500 animate-pulse">Loading...</div>
            ) : accessoriesQuery.isError ? (
              <div className="py-32 text-center text-red-500">Error loading accessories.</div>
            ) : accessoriesQuery.data?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {accessoriesQuery.data.map((accessory: any) => (
                  <AccessoryCard key={accessory.id} accessory={accessory} />
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
