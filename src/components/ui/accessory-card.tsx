
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Accessory = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  image_url?: string;
  description?: string;
};

export function AccessoryCard({ accessory }: { accessory: Accessory }) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={accessory.image_url || "/placeholder.svg"}
          alt={accessory.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <Badge className="absolute top-3 left-3 bg-blue-600 text-white">{accessory.category}</Badge>
      </div>
      <CardContent className="p-5">
        <div className="mb-1 font-heading text-lg text-balance">{accessory.name}</div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
          <Badge variant="outline">{accessory.brand}</Badge>
        </div>
        <div className="text-2xl font-bold text-accent mb-3">
          ₹{new Intl.NumberFormat("en-IN").format(accessory.price)}
        </div>
        <Button className="w-full">Add to Cart</Button>
      </CardContent>
    </Card>
  );
}
