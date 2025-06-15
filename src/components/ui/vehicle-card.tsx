
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Vehicle = {
  id: string;
  name: string;
  brand: string;
  type: string;
  fuel: string;
  price: number;
  image_url?: string;
  description?: string;
  transmission?: string;
  is_available?: boolean;
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={vehicle.image_url || '/placeholder.svg'}
          alt={vehicle.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <Badge
          className={`absolute top-3 left-3 ${vehicle.is_available ? "bg-green-500" : "bg-gray-400"}`}
        >
          {vehicle.is_available ? "In Stock" : "Sold Out"}
        </Badge>
      </div>
      <CardContent className="p-5">
        <div className="mb-1 font-heading text-lg text-balance">{vehicle.name}</div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
          <Badge variant="outline">{vehicle.brand}</Badge>
          <Badge variant="outline">{vehicle.fuel}</Badge>
          {vehicle.transmission && <Badge variant="outline">{vehicle.transmission}</Badge>}
        </div>
        <div className="text-2xl font-bold text-blue-700 mb-3">
          ₹{new Intl.NumberFormat("en-IN").format(vehicle.price)}
        </div>
        <Button className="w-full">{vehicle.is_available ? "View Details" : "Notify Me"}</Button>
      </CardContent>
    </Card>
  );
}
