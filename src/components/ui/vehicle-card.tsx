
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Vehicle = {
  id: string;
  category: "car" | "bike";
  brand: string;
  model: string;
  fuel?: string;
  transmission?: string;
  price: number;
  available?: boolean;
  image_url?: string;
  description?: string;
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200 bg-white">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={vehicle.image_url || "/placeholder.svg"}
          alt={vehicle.brand + " " + vehicle.model}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <Badge
          className={`absolute top-3 left-3 capitalize ${
            vehicle.available ? "bg-green-500" : "bg-gray-400"
          } text-white`}
        >
          {vehicle.available ? "Available" : "Unavailable"}
        </Badge>
        <Badge className="absolute top-3 right-3 bg-slate-700 text-white capitalize">{vehicle.category}</Badge>
      </div>
      <CardContent className="p-5">
        <div className="mb-1 font-heading text-lg">{vehicle.brand} {vehicle.model}</div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
          {vehicle.fuel && <Badge variant="outline">{vehicle.fuel}</Badge>}
          {vehicle.transmission && <Badge variant="outline">{vehicle.transmission}</Badge>}
        </div>
        <div className="text-2xl font-bold text-blue-700 mb-3">
          ₹{new Intl.NumberFormat("en-IN").format(vehicle.price)}
        </div>
        <Button className="w-full" disabled={!vehicle.available}>
          {vehicle.available ? "Rent / Buy" : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  );
}
