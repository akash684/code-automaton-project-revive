
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Accessory = {
  id: string;
  name: string;
  category: string;
  compatible_vehicle_types: string[];
  price: number;
  stock: number;
  available: boolean;
  image_url?: string;
  description?: string;
};

export function AccessoryCard({ accessory }: { accessory: Accessory }) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200 bg-white">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={accessory.image_url || "/placeholder.svg"}
          alt={accessory.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <Badge className={`absolute top-3 left-3 capitalize ${accessory.available ? "bg-green-500" : "bg-gray-400"} text-white`}>
          {accessory.available ? "In Stock" : "Out of Stock"}
        </Badge>
        <Badge className="absolute top-3 right-3 bg-blue-700 text-white">{accessory.category}</Badge>
      </div>
      <CardContent className="p-5">
        <div className="mb-1 font-heading text-lg">{accessory.name}</div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
          {accessory.compatible_vehicle_types.map((t) => (
            <Badge variant="outline" key={t}>{t}</Badge>
          ))}
        </div>
        <div className="text-2xl font-bold text-blue-700 mb-3">
          ₹{new Intl.NumberFormat("en-IN").format(accessory.price)}
        </div>
        <div className="text-sm text-gray-800 mb-2">Stock: {accessory.stock}</div>
        <Button className="w-full" disabled={!accessory.available}>
          {accessory.available ? "Rent / Buy" : "Unavailable"}
        </Button>
      </CardContent>
    </Card>
  );
}
