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
    <Card
      className="rounded-2xl border p-4 transition-shadow bg-card text-foreground hover:shadow-lg"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={vehicle.image_url || "/placeholder.svg"}
          alt={vehicle.brand + ' ' + vehicle.model}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <Badge
          className={`absolute top-3 left-3 capitalize ${
            vehicle.available ? "bg-success text-background" : "bg-muted text-foreground"
          }`}
        >
          {vehicle.available ? "Available" : "Unavailable"}
        </Badge>
        <Badge className="absolute top-3 right-3 bg-accent text-background capitalize">{vehicle.category}</Badge>
      </div>
      <CardContent className="p-5">
        <div className="mb-1 font-heading text-lg">{vehicle.brand} {vehicle.model}</div>
        <div className="flex flex-wrap gap-2 text-sm text-muted mb-2">
          {vehicle.fuel && <Badge variant="outline" className="bg-background/60 text-foreground">{vehicle.fuel}</Badge>}
          {vehicle.transmission && <Badge variant="outline" className="bg-background/60 text-foreground">{vehicle.transmission}</Badge>}
        </div>
        <div className="text-2xl font-bold text-accent mb-3">
          ₹{new Intl.NumberFormat("en-IN").format(vehicle.price)}
        </div>
        <Button className="w-full" disabled={!vehicle.available}>
          {vehicle.available ? "Rent / Buy" : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  );
}
