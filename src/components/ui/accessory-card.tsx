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
    <Card
      className="rounded-2xl border p-4 transition-shadow bg-card text-foreground hover:shadow-lg"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={accessory.image_url || "/placeholder.svg"}
          alt={accessory.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <Badge
          className={`absolute top-3 left-3 capitalize ${
            accessory.available ? "bg-success text-background" : "bg-muted text-foreground"
          }`}
        >
          {accessory.available ? "In Stock" : "Out of Stock"}
        </Badge>
        <Badge className="absolute top-3 right-3 bg-accent text-background">{accessory.category}</Badge>
      </div>
      <CardContent className="p-5">
        <div className="mb-1 font-heading text-lg">{accessory.name}</div>
        <div className="flex flex-wrap gap-2 text-sm text-muted mb-2">
          {accessory.compatible_vehicle_types.map((t) => (
            <Badge variant="outline" key={t} className="bg-background/60 text-foreground">{t}</Badge>
          ))}
        </div>
        <div className="text-2xl font-bold text-accent mb-3">
          ₹{new Intl.NumberFormat("en-IN").format(accessory.price)}
        </div>
        <div className="text-sm text-muted mb-2">Stock: {accessory.stock}</div>
        <Button className="w-full" disabled={!accessory.available}>
          {accessory.available ? "Rent / Buy" : "Unavailable"}
        </Button>
      </CardContent>
    </Card>
  );
}
