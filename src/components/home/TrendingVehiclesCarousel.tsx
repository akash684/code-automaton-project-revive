
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bike, Car, Bolt, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type Vehicle = {
  id: number;
  name: string;
  brand: string;
  model: string;
  fuel?: string;
  price: number;
  image_url?: string;
  category?: string;
  featured?: boolean;
  type?: string;
};

export default function TrendingVehiclesCarousel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured vehicles (both cars & bikes, sorted by featured & new)
    const fetchVehicles = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .eq("featured", true)
        .in("category", ["car", "bike"])
        .order("id", { ascending: false })
        .limit(12);
      if (!error) setVehicles(data as Vehicle[]);
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-400 border-t-transparent"></div>
      </div>
    );
  }
  if (!vehicles.length) {
    return (
      <div className="text-center text-slate-300 py-16">
        🚗 No featured cars/bikes found. 
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">Trending Vehicles</h2>
      <div className="relative">
        <Carousel className="px-8">
          <CarouselPrevious />
          <CarouselContent>
            {vehicles.map((v) => (
              <CarouselItem key={v.id} className="basis-96">
                <Card className="glass morph group relative rounded-2xl shadow-xl border-0 overflow-hidden transition hover:scale-105">
                  <div className="relative w-full h-52">
                    <img
                      src={v.image_url || "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500"}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      {v.category === "car" ? (
                        <Badge className="bg-blue-600/80 text-white"><Car className="w-4 h-4 inline" /> Car</Badge>
                      ) : (
                        <Badge className="bg-purple-500/80 text-white"><Bike className="w-4 h-4 inline" /> Bike</Badge>
                      )}
                      {v.featured && (
                        <Badge className="bg-green-700/80 text-white animate-pulse">Featured</Badge>
                      )}
                      {v.type === "electric" && (
                        <Badge className="bg-teal-500/80 text-white"><Bolt className="w-4 h-4 inline" /> Electric</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-5 pt-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-lg">{v.brand} {v.model}</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="bg-white/10 border-white/10 text-blue-100">{v.fuel || "Petrol"}</Badge>
                      <span className="font-mono text-green-300">{v.price.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</span>
                    </div>
                    <Button size="sm" className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">View Details</Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
