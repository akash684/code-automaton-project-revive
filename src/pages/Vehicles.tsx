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
import { useState, useEffect } from "react";
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

type Product = {
  id: string | number;
  category: "car" | "bike" | "accessory";
  model: string;
  brand: string;
  price: number;
  image_url: string | null;
  available: boolean;
  fuel?: string;
  transmission?: string;
};

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
  // Remove buyModalOpen and selectedItem, since we use Razorpay flow now:
  // const [buyModalOpen, setBuyModalOpen] = useState(false);
  // const [selectedItem, setSelectedItem] = useState<any>(null);

  // Dynamic filter options
  const brandsQuery = useQuery<string[]>({ queryKey: ["vehicle-brands"], queryFn: fetchVehicleBrands });
  const fuelQuery = useQuery<string[]>({ queryKey: ["vehicle-fuels"], queryFn: fetchVehicleFuelTypes });
  const transQuery = useQuery<string[]>({ queryKey: ["vehicle-transmissions"], queryFn: fetchVehicleTransmissions });

  // ——— FETCH LOGIC: Always fetch cars/bikes per filters ———
  const vehiclesQuery = useQuery({
    queryKey: ["vehicles", filters, search, sort],
    queryFn: async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      // Normalize filters
      const catFilter = filters.category === "all" ? null : filters.category.toLowerCase().trim();
      const brandFilter = filters.brand === "all" ? null : filters.brand.toLowerCase().trim();
      const fuelFilter = filters.fuel === "all" ? null : filters.fuel.toLowerCase().trim();
      const transFilter = filters.transmission === "all" ? null : filters.transmission.toLowerCase().trim();

      let query = supabase.from<Product>("products").select("*");

      if (catFilter) {
        query = query.eq("category", catFilter);
      } else {
        query = query.in("category", ["car", "bike"]); // Always filter for car/bike if no specific filter
      }
      if (search) query = query.ilike("model", `%${search}%`);
      if (sort === "price-asc") query = query.order("price", { ascending: true });
      else if (sort === "price-desc") query = query.order("price", { ascending: false });
      if (brandFilter) query = query.eq("brand", brandFilter);
      if (fuelFilter) query = query.eq("fuel", fuelFilter);
      if (transFilter) query = query.eq("transmission", transFilter);

      if (
        filters.priceRange &&
        (filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] || filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1])
      ) {
        query = query
          .gte("price", filters.priceRange[0])
          .lte("price", filters.priceRange[1]);
      }

      const { data, error } = await query;
      console.table(data); // TEMP: To help you verify fetched cars/bikes

      if (error) {
        console.error("Failed to fetch vehicles:", error.message);
        return [];
      }
      if (!data || data.length === 0) {
        // Notify user something is still wrong
        toast.info("No cars or bikes found. Check filters or Supabase policy.");
      }
      return data ?? [];
    }
  });

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Razorpay Integration handler — can be converted to actual Razorpay with a public key!
  async function handleBuyNow(vehicle: any) {
    // If Razorpay is not loaded, show a toast and fallback to mock success
    if (!window.Razorpay) {
      // @ts-ignore
      import('sonner').then(({ toast }) => toast.info("Razorpay not integrated in this demo - simulate payment success! 🎉"));
      // Optionally: logic to save as purchased in Supabase/orders
      return;
    }
    // Razorpay checkout options
    const options = {
      key: "rzp_test_XXXXXXXXXXXX", // Replace this with your Razorpay public key!
      amount: Math.round(Number(vehicle.price) * 100), // INR in paise
      currency: "INR",
      name: "Vehicle Purchase",
      description: `Buy ${vehicle.brand} ${vehicle.model}`,
      image: vehicle.image_url, // Logo or vehicle image URL
      handler: function (response: any) {
        // @ts-ignore
        import('sonner').then(({ toast }) => toast.success(`Payment successful! Payment ID: ${response.razorpay_payment_id}`));
        // Here, record purchase in Supabase if desired
      },
      prefill: {
        name: "",
        email: "",
      },
      notes: {
        model: vehicle.model,
        brand: vehicle.brand,
      },
      theme: { color: "#3b82f6" }
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehiclesQuery.data.map((vehicle: any) => (
                  <div
                    key={vehicle.id}
                    className="overflow-hidden bg-card text-foreground border border-border rounded-2xl transition-shadow hover:shadow-lg flex flex-col"
                    aria-label={`${vehicle.brand ?? ''} ${vehicle.model}`}
                  >
                    <div className="relative w-full h-44 overflow-hidden">
                      <img
                        src={vehicle.image_url || "/placeholder.svg"}
                        alt={vehicle.model}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                      />
                      <span
                        className={`absolute top-3 left-3 capitalize px-2 py-1 rounded font-bold text-xs ${
                          vehicle.available ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                        }`}
                        role="status"
                        aria-label={vehicle.available ? "Available" : "Unavailable"}
                      >
                        {vehicle.available ? "Available" : "Unavailable"}
                      </span>
                      <span className="absolute top-3 right-3 bg-blue-700 text-white capitalize px-2 py-1 rounded font-bold text-xs">
                        {vehicle.category}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col p-5">
                      <div className="mb-1 font-heading text-lg font-semibold">{vehicle.model}</div>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-300 mb-2">
                        <span className="bg-white/10 border border-gray-800 dark:bg-gray-800/50 rounded px-2 py-0.5">{vehicle.brand}</span>
                        <span className="bg-white/10 border border-gray-800 dark:bg-gray-800/50 rounded px-2 py-0.5">{vehicle.fuel}</span>
                        <span className="bg-white/10 border border-gray-800 dark:bg-gray-800/50 rounded px-2 py-0.5">{vehicle.transmission}</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-400 mb-3">
                        ₹{new Intl.NumberFormat("en-IN").format(vehicle.price)}
                      </div>
                      <button
                        className="flex-1 bg-gradient-to-r from-blue-700 to-purple-700 text-white font-bold py-2 px-4 rounded-xl mt-auto w-full transition-colors hover:from-blue-800 hover:to-purple-800 disabled:bg-gray-400"
                        disabled={!vehicle.available}
                        aria-label="Buy Now"
                        onClick={() => handleBuyNow(vehicle)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatedEmpty message="No vehicles available right now." onReset={handleReset} />
            )}
          </section>
        </div>
      </main>
      {/* Razorpay embed script loader - only loads once, idempotent */}
      <RazorpayScriptLoader />
    </div>
  );
}

// --- Razorpay Script Loader (loads the checkout script if not present) ---
function RazorpayScriptLoader() {
  // Only load if not already present
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.id = "razorpay-js";
      document.body.appendChild(script);
    }
  }, []);
  return null;
}
