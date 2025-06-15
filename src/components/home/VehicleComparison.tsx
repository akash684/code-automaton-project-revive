
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const models = [
  {
    name: "Tata Nexon EV",
    img: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500",
    price: 1450000,
    range: "312km",
    fuel: "Electric",
    transmission: "Automatic",
  },
  {
    name: "Maruti Suzuki Swift",
    img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500",
    price: 750000,
    range: "22km/l",
    fuel: "Petrol",
    transmission: "Manual",
  },
  {
    name: "Hyundai Creta",
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
    price: 1400000,
    range: "17km/l",
    fuel: "Diesel",
    transmission: "Automatic",
  },
];
export default function VehicleComparison() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-5">Compare Top Vehicles</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {models.map((m) => (
          <Card className="glass morph rounded-2xl shadow-lg border-0 bg-white/15 max-w-xs flex-1 min-w-[250px]" key={m.name}>
            <div className="flex justify-center mt-3">
              <img src={m.img} alt={m.name} className="rounded-xl w-40 h-24 object-cover" />
            </div>
            <CardContent className="py-2 px-5">
              <div className="font-bold text-white mb-1">{m.name}</div>
              <div className="flex gap-2 text-sm font-mono">
                <Badge className="bg-green-300/90 text-black">
                  {m.price.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                </Badge>
                <Badge className="bg-purple-500/90">{m.range}</Badge>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-blue-900/30">{m.fuel}</Badge>
                <Badge variant="outline" className="bg-blue-600/20">{m.transmission}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
