import { useQuery } from "@tanstack/react-query";
import { fetchAccessories, fetchAccessoryCategories } from "@/services/supabase/products";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useState } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { AnimatedEmpty } from "@/components/ui/animated-empty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { BuyModal } from "@/components/BuyModal";
import { toast } from "sonner";

export default function Accessories() {
  const [filters, setFilters] = useState({
    category: "all",
    compatibleVehicleType: "all",
    inStock: "all",
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Dynamic filters
  const catQuery = useQuery<string[]>({ queryKey: ["accessory-categories"], queryFn: fetchAccessoryCategories });

  const accessoriesQuery = useQuery({
    queryKey: ["accessories", filters, search, sort],
    queryFn: () =>
      fetchAccessories({
        category: filters.category === "all" ? undefined : filters.category,
        compatibleVehicleType:
          filters.compatibleVehicleType === "all" ? undefined : filters.compatibleVehicleType,
        inStock: filters.inStock === "all" ? undefined : filters.inStock === "true",
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
          <aside className="md:w-72 mb-4 shrink-0">
            <div className="space-y-6 p-6 rounded-2xl shadow bg-white/70 dark:bg-gray-900/50 backdrop-blur-lg">
              {/* Category */}
              <div>
                <div className="font-medium mb-1">Type</div>
                <Select
                  value={filters.category}
                  onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="all"
                      className="flex items-center text-gray-700 font-semibold"
                    >
                      All Types
                    </SelectItem>
                    {catQuery.data?.map((cat: string) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className={
                          cat.toLowerCase().includes("helmet")
                            ? "flex items-center text-blue-700 font-bold"
                            : cat.toLowerCase().includes("gloves")
                            ? "flex items-center text-green-700"
                            : cat.toLowerCase().includes("jackets")
                            ? "flex items-center text-pink-700"
                            : cat.toLowerCase().includes("mobile")
                            ? "flex items-center text-teal-700"
                            : cat.toLowerCase().includes("gps")
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
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, compatibleVehicleType: v }))
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
                  onValueChange={(v) => setFilters((f) => ({ ...f, inStock: v }))}
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search accessories…"
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
            {/* Loading/Empty/Results */}
            {accessoriesQuery.isLoading ? (
              <div className="py-32 text-center text-gray-500 animate-pulse">Loading...</div>
            ) : accessoriesQuery.isError ? (
              <div className="py-32 text-center text-red-500">Error loading accessories.</div>
            ) : accessoriesQuery.data?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {accessoriesQuery.data.map((accessory: any) => (
                  <ModernCard key={accessory.id} className="overflow-hidden">
                    <motion.div
                      className="relative w-full h-44 overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={accessory.image_url || "/placeholder.svg"}
                        alt={accessory.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                      />
                      <Badge
                        className={`absolute top-3 left-3 capitalize ${
                          accessory.available ? "bg-green-500" : "bg-gray-400"
                        } text-white`}
                      >
                        {accessory.available ? "In Stock" : "Out of Stock"}
                      </Badge>
                      <Badge className="absolute top-3 right-3 bg-blue-700 text-white">
                        {accessory.category}
                      </Badge>
                    </motion.div>
                    <CardContent className="p-5">
                      <div className="mb-1 font-heading text-lg font-semibold">{accessory.name}</div>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                        {accessory.compatible_vehicle_types.map((t: string) => (
                          <Badge
                            variant="outline"
                            key={t}
                            className="bg-white/50 dark:bg-gray-800/50"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-2xl font-bold text-blue-700 mb-3">
                        ₹{new Intl.NumberFormat("en-IN").format(accessory.price)}
                      </div>
                      <div className="text-sm text-gray-800 mb-2">Stock: {accessory.stock}</div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          variant="outline"
                          disabled={!accessory.available}
                          onClick={() => { toast.success('Rent flow coming soon!'); }}
                        >
                          Rent Now
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          disabled={!accessory.available}
                          onClick={() => {
                            setSelectedItem({
                              name: accessory.name,
                              price: accessory.price,
                              image_url: accessory.image_url
                            });
                            setBuyModalOpen(true);
                          }}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </CardContent>
                  </ModernCard>
                ))}
                <BuyModal
                  open={buyModalOpen}
                  onOpenChange={setBuyModalOpen}
                  item={selectedItem || { name: "", price: 0 }}
                  itemType="Accessory"
                />
              </div>
            ) : (
              <AnimatedEmpty message="No accessories available right now." onReset={handleReset} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
