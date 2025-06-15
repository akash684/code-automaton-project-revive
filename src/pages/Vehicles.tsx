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
import { ModernCard } from "@/components/ui/modern-card";
import { AnimatedEmpty } from "@/components/ui/animated-empty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { BuyModal } from "@/components/BuyModal";
import { toast } from "sonner";
import { useWishlist } from '@/hooks/useWishlist';
import { Heart } from "lucide-react";

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
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

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

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

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
                    <SelectItem value="all" className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white">
                      All Types
                    </SelectItem>
                    <SelectItem value="car" className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white">
                      Car
                    </SelectItem>
                    <SelectItem value="bike" className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white">
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
                  onValueChange={v => setFilters(f => ({ ...f, brand: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white">
                      All Brands
                    </SelectItem>
                    {brandsQuery.data?.map((brand: string) => (
                      <SelectItem key={brand} value={brand} className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white">
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
                    <SelectItem value="all" className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white">
                      All Fuels
                    </SelectItem>
                    {fuelQuery.data?.map((f: string) => (
                      <SelectItem key={f} value={f} className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white">
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
                    <SelectItem value="all" className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white">
                      All Types
                    </SelectItem>
                    {transQuery.data?.map((t: string) => (
                      <SelectItem key={t} value={t} className="bg-[#0D1B3C] text-white hover:bg-[#132347] data-[state=checked]:bg-[#0D1B3C] data-[state=checked]:text-white">
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
            {/* Loading/Empty/Results */}
            {vehiclesQuery.isLoading ? (
              <div className="py-32 text-center text-muted animate-pulse">Loading...</div>
            ) : vehiclesQuery.isError ? (
              <div className="py-32 text-center text-error">Error loading vehicles.</div>
            ) : vehiclesQuery.data?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {vehiclesQuery.data.map((vehicle: any) => (
                  <div key={vehicle.id} className="overflow-hidden bg-card text-foreground border border-border rounded-2xl transition-shadow hover:shadow-lg">
                    <motion.div
                      className="relative w-full h-44 overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={vehicle.image_url || "/placeholder.svg"}
                        alt={vehicle.model}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                      />
                      <Badge
                        className={`absolute top-3 left-3 capitalize ${
                          vehicle.available ? "bg-green-500" : "bg-gray-400"
                        } text-white`}
                      >
                        {vehicle.available ? "Available" : "Unavailable"}
                      </Badge>
                      <Badge className="absolute top-3 right-3 bg-blue-700 text-white capitalize">
                        {vehicle.category}
                      </Badge>
                    </motion.div>
                    <CardContent className="p-5">
                      <div className="mb-1 font-heading text-lg font-semibold">{vehicle.model}</div>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-300 mb-2">
                        <Badge variant="outline" className="bg-white/10 border-gray-800 dark:bg-gray-800/50">{vehicle.brand}</Badge>
                        <Badge variant="outline" className="bg-white/10 border-gray-800 dark:bg-gray-800/50">{vehicle.fuel}</Badge>
                        <Badge variant="outline" className="bg-white/10 border-gray-800 dark:bg-gray-800/50">{vehicle.transmission}</Badge>
                      </div>
                      <div className="text-2xl font-bold text-blue-400 mb-3">
                        ₹{new Intl.NumberFormat("en-IN").format(vehicle.price)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-blue-700 to-purple-700 text-white"
                          disabled={!vehicle.available}
                          onClick={() => {
                            setSelectedItem({
                              name: vehicle.model,
                              price: vehicle.price,
                              image_url: vehicle.image_url
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
                  itemType="Vehicle"
                />
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
