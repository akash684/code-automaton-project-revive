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
import { useWishlist } from "@/hooks/useWishlist";
import { Heart } from "lucide-react";

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

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

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
    <div className="bg-background min-h-screen text-foreground">
      <main className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-72 mb-4 shrink-0">
            <div className="space-y-6 p-6 rounded-2xl bg-card text-foreground border border-border shadow backdrop-blur-lg">
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
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white font-semibold"
                    >
                      All Types
                    </SelectItem>
                    {catQuery.data?.map((cat: string) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white"
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
                    <SelectItem
                      value="all"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white"
                    >
                      All Vehicles
                    </SelectItem>
                    <SelectItem
                      value="car"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white"
                    >
                      Car
                    </SelectItem>
                    <SelectItem
                      value="bike"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white"
                    >
                      Bike
                    </SelectItem>
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
                    <SelectItem
                      value="all"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white"
                    >
                      All
                    </SelectItem>
                    <SelectItem
                      value="true"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white"
                    >
                      In Stock
                    </SelectItem>
                    <SelectItem
                      value="false"
                      className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white"
                    >
                      Out of Stock
                    </SelectItem>
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
              <div className="py-32 text-center text-muted animate-pulse">Loading...</div>
            ) : accessoriesQuery.isError ? (
              <div className="py-32 text-center text-error">Error loading accessories.</div>
            ) : accessoriesQuery.data?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {accessoriesQuery.data.map((accessory: any) => (
                  <div key={accessory.id} className="overflow-hidden bg-card text-foreground border border-border rounded-2xl transition-shadow hover:shadow-lg">
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
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`absolute bottom-3 right-3 border ${
                          isInWishlist(accessory.id)
                            ? "bg-pink-700 border-pink-400 text-white"
                            : "bg-gray-900 border-gray-700 text-gray-300"
                        }`}
                        onClick={() =>
                          isInWishlist(accessory.id)
                            ? removeFromWishlist(accessory.id)
                            : addToWishlist(accessory.id)
                        }
                        aria-label={isInWishlist(accessory.id) ? "Remove from favourites" : "Add to favourites"}
                        title={isInWishlist(accessory.id) ? "Remove from favourites" : "Add to favourites"}
                      >
                        <Heart fill={isInWishlist(accessory.id) ? "#ec4899" : "none"} className="w-5 h-5" />
                      </Button>
                    </motion.div>
                    <CardContent className="p-5">
                      <div className="mb-1 font-heading text-lg font-semibold">{accessory.name}</div>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-300 mb-2">
                        {accessory.compatible_vehicle_types.map((t: string) => (
                          <Badge
                            variant="outline"
                            key={t}
                            className="bg-white/10 dark:bg-gray-800/50 text-white border-gray-800"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-2xl font-bold text-blue-400 mb-3">
                        ₹{new Intl.NumberFormat("en-IN").format(accessory.price)}
                      </div>
                      <div className="text-sm text-gray-300 mb-2">Stock: {accessory.stock}</div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-blue-700 to-purple-700 text-white"
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
                  </div>
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
