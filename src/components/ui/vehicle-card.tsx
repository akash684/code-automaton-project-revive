
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { Vehicle } from "@/types/supabase";

// VehicleCard styled and structured like AccessoryCard
interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  // Compose badges for category, fuel, transmission for the vehicle (can adjust per project needs)
  return (
    <Card className="rounded-2xl border transition-shadow bg-card text-foreground hover:shadow-lg group overflow-hidden">
      <div className="relative w-full h-48 overflow-hidden flex items-center justify-center bg-background">
        {/* Image */}
        <img
          src={vehicle.image_url || "/placeholder.svg"}
          alt={vehicle.brand + " " + vehicle.model}
          className="object-contain w-full h-full"
          loading="lazy"
        />
        {/* In stock / Unavailable badge */}
        <Badge
          className={`absolute top-3 left-3 px-3 py-1 rounded-full capitalize font-semibold z-10 ${
            vehicle.available ? "bg-success text-background" : "bg-muted text-foreground"
          }`}
        >
          {vehicle.available ? "In Stock" : "Unavailable"}
        </Badge>
        {/* Category */}
        <Badge className="absolute top-3 right-3 bg-accent text-background px-3 py-1 rounded-full capitalize font-semibold z-10">
          {vehicle.category}
        </Badge>
      </div>
      <CardContent className="p-5 flex flex-col flex-1">
        {/* Title */}
        <div className="font-heading text-lg font-bold mb-1">
          {vehicle.brand} {vehicle.model}
        </div>
        {/* Details badges */}
        <div className="flex flex-wrap gap-2 text-xs text-muted mb-2">
          {vehicle.fuel && (
            <Badge variant="outline" className="bg-background/60 text-foreground">
              {vehicle.fuel}
            </Badge>
          )}
          {vehicle.transmission && (
            <Badge variant="outline" className="bg-background/60 text-foreground">
              {vehicle.transmission}
            </Badge>
          )}
        </div>
        {/* Price */}
        <div className="text-2xl font-bold text-accent mb-3">
          ₹{new Intl.NumberFormat("en-IN").format(vehicle.price)}
        </div>
        <div className="flex-1" />
        {/* Buy Now button */}
        <Button
          className="w-full font-semibold rounded-xl py-2 mt-2"
          disabled={!vehicle.available}
        >
          {vehicle.available ? "Buy Now" : "Unavailable"}
        </Button>
      </CardContent>
    </Card>
  );
}
