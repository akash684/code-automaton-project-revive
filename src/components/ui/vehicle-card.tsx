
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { Vehicle } from "@/types/supabase";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  // Compose compatible types badges
  const typeBadges = ["car", "bike"].filter(t => vehicle.category && vehicle.category.toLowerCase().includes(t));

  return (
    <div className="w-full max-w-xs rounded-2xl border border-border bg-card text-foreground shadow-md flex flex-col overflow-hidden">
      {/* Image & badges */}
      <div className="relative h-48 bg-background flex items-center justify-center overflow-hidden">
        <img
          src={vehicle.image_url || "/placeholder.svg"}
          alt={vehicle.brand + " " + vehicle.model}
          className="object-contain h-40"
          loading="lazy"
        />
        {/* Stock */}
        <Badge
          className={
            "absolute top-3 left-3 font-semibold px-3 py-1 rounded-full z-10" +
            (vehicle.available
              ? " bg-success text-background"
              : " bg-muted text-foreground")
          }
        >
          {vehicle.available ? "In Stock" : "Unavailable"}
        </Badge>
        {/* Category */}
        <Badge className="absolute top-3 right-3 font-semibold px-3 py-1 rounded-full bg-accent text-background z-10 capitalize">
          {vehicle.category}
        </Badge>
      </div>
      {/* Details */}
      <div className="flex flex-col flex-1 p-4 bg-background dark:bg-card">
        {/* Name */}
        <div className="font-heading text-lg font-bold mb-0.5">
          {vehicle.brand} {vehicle.model}
        </div>
        {/* Type/fuel/transmission badges */}
        <div className="flex flex-wrap gap-1 text-xs mb-2">
          {vehicle.fuel && <Badge variant="outline" className="bg-background/60 text-foreground">{vehicle.fuel}</Badge>}
          {vehicle.transmission && (
            <Badge variant="outline" className="bg-background/60 text-foreground">{vehicle.transmission}</Badge>
          )}
          {/* Category as badge only if not shown as main category */}
          {typeBadges.map(type =>
            <Badge key={type} variant="outline" className="bg-muted text-foreground capitalize">{type}</Badge>
          )}
        </div>
        {/* Price */}
        <div className="text-2xl font-bold text-accent mb-1">
          ₹{new Intl.NumberFormat("en-IN").format(vehicle.price)}
        </div>
        {/* Stock (for demo we use available info only) */}
        <div className="text-sm text-muted mb-2">
          {vehicle.available ? "Available" : "Out of Stock"}
        </div>
        {/* Buy Now button */}
        <Button
          className="mt-auto w-full font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-base rounded-2xl py-3 hover:from-indigo-600 hover:to-fuchsia-600 shadow"
          disabled={!vehicle.available}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
