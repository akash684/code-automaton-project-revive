
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const accessoryCategories = [
  { label: "Helmet", value: "helmet" },
  { label: "Gloves", value: "gloves" },
  { label: "GPS Tracker", value: "gps" },
  { label: "Jacket", value: "jacket" },
  { label: "Security", value: "security" },
  { label: "All", value: "" },
];

export default function AccessoriesHighlights() {
  const [category, setCategory] = useState("");
  const [accessories, setAccessories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      let query = supabase.from("products").select("*").eq("category", "accessory").eq("available", true);
      if (category && category !== "all") {
        query = query.ilike("name", `%${category}%`);
      }
      const { data, error } = await query.limit(8);
      if (!error) setAccessories(data || []);
      setLoading(false);
    };
    fetchAccessories();
  }, [category]);

  return (
    <section className="py-10">
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <h2 className="text-2xl font-bold">Accessories Highlights</h2>
        <div className="flex gap-2">
          {accessoryCategories.map((cat) => (
            <Button
              key={cat.value}
              size="sm"
              onClick={() => setCategory(cat.value)}
              className={`rounded-full px-4 py-1 ${category === cat.value ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "bg-white/20 text-white/70"}`}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-400"></div>
        </div>
      ) : !accessories.length ? (
        <div className="text-center text-slate-400 py-10">No accessories found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {accessories.map((a) => (
            <Card key={a.id} className="glass morph group transition cursor-pointer hover:scale-105 bg-white/10 dark:bg-[#23263b]/40 shadow-md border-0 overflow-hidden">
              <div className="relative h-24 flex justify-center items-center bg-black/30">
                <img
                  src={a.image_url || "/placeholder.svg"}
                  alt={a.name}
                  className="max-h-20 w-auto object-contain"
                  loading="lazy"
                />
                {a.featured && (
                  <Badge className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-500">Featured</Badge>
                )}
              </div>
              <CardContent className="p-3 flex flex-col gap-1">
                <span className="font-bold text-white">{a.name}</span>
                <div className="flex gap-2 items-center">
                  <span className="text-blue-100 font-mono">{a.price?.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</span>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
