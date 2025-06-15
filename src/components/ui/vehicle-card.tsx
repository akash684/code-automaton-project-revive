
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { Vehicle as VehicleBase } from "@/types/supabase";

// Extend vehicle to include optional properties for accessory card parity
interface VehicleCardProps {
  vehicle: VehicleBase & {
    compatible_vehicle_types?: string[];
    stock?: number; // <-- Accept optional stock
  };
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const compatible = vehicle.compatible_vehicle_types || [];
  // Use stock property with proper fallback. Show "--" if undefined/null.
  const stockDisplay =
    typeof vehicle.stock === "number" && Number.isFinite(vehicle.stock)
      ? vehicle.stock
      : "--";
  const isInStock =
    vehicle.available && typeof vehicle.stock === "number" && vehicle.stock > 0;

  return (
    <Card className="rounded-2xl border p-4 transition-shadow bg-[#0d111c] text-white hover:shadow-lg w-[250px] flex flex-col overflow-hidden relative font-sans">
      <div className="relative w-full h-44 overflow-hidden flex items-center justify-center bg-[#111524] mb-0">
        <img
          src={vehicle.image_url || "/placeholder.svg"}
          alt={vehicle.brand + " " + vehicle.model}
          className="h-32 object-contain drop-shadow-lg"
          style={{ maxWidth: "80%" }}
          loading="lazy"
        />
        {/* Stock Badge */}
        <Badge
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold z-10 ${
            isInStock ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isInStock ? "In Stock" : "Out of Stock"}
        </Badge>
        {/* Category Badge */}
        <Badge className="absolute top-3 right-3 bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
          {vehicle.category}
        </Badge>
      </div>
      <CardContent className="pt-2 px-0 pb-0 flex flex-col flex-1">
        {/* Title */}
        <div className="text-lg font-bold text-white mb-2 leading-snug">
          {vehicle.brand} {vehicle.model}
        </div>
        {/* Compatible pills */}
        <div className="flex flex-wrap gap-2 mb-2">
          {compatible.map((type) => (
            <span
              key={type}
              className="bg-[#23283c] text-gray-100 rounded-full px-3 py-0.5 text-xs font-semibold"
            >
              {type}
            </span>
          ))}
        </div>
        {/* Price */}
        <div className="text-2xl font-extrabold text-blue-400 mb-1">
          ₹{new Intl.NumberFormat("en-IN").format(vehicle.price)}
        </div>
        {/* Stock count */}
        <div className="text-sm text-gray-400 mb-4">
          Stock: {stockDisplay}
        </div>
        {/* Buy button */}
        <Button
          className="w-full py-3 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md transition-all hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
          disabled={!isInStock}
        >
          Buy Now
        </Button>
      </CardContent>
    </Card>
  );
}

