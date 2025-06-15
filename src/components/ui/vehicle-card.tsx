
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";
import { Vehicle as VehicleBase } from "@/types/supabase";

interface VehicleCardProps {
  vehicle: VehicleBase & {
    compatible_vehicle_types?: string[];
    stock?: number;
  };
  setSelectedItem?: (item: { name: string; price: number; image_url: string }) => void;
  setBuyModalOpen?: (open: boolean) => void;
}

export function VehicleCard({
  vehicle,
  setSelectedItem,
  setBuyModalOpen,
}: VehicleCardProps) {
  const compatible = vehicle.compatible_vehicle_types || [];
  const isInStock =
    vehicle.available && typeof vehicle.stock === "number" && vehicle.stock > 0;
  const stockDisplay =
    typeof vehicle.stock === "number" ? vehicle.stock : "--";
  const title = [vehicle.brand, vehicle.model].filter(Boolean).join(" ");

  return (
    <div className="overflow-hidden bg-card text-foreground border border-border rounded-2xl transition-shadow hover:shadow-lg">
      <motion.div
        className="relative w-full h-44 overflow-hidden"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={vehicle.image_url || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          style={{ objectFit: "cover" }}
        />
        <Badge
          className={`absolute top-3 left-3 capitalize ${
            isInStock ? "bg-green-500" : "bg-gray-400"
          } text-white`}
        >
          {isInStock ? "In Stock" : "Out of Stock"}
        </Badge>
        <Badge className="absolute top-3 right-3 bg-blue-700 text-white">
          {vehicle.category}
        </Badge>
      </motion.div>
      <CardContent className="p-5">
        <div className="mb-1 font-heading text-lg font-semibold">{title}</div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-300 mb-2">
          {compatible.map((t: string) => (
            <Badge
              variant="outline"
              key={t}
              className="bg-white/10 dark:bg-gray-800/50 text-white border-gray-800"
            >
              {t}
            </Badge>
          ))}
        </div>
        <div className="text-2xl font-bold text-blue-400 mb-3">
          ₹{new Intl.NumberFormat("en-IN").format(vehicle.price)}
        </div>
        <div className="text-sm text-gray-300 mb-2">Stock: {stockDisplay}</div>
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-blue-700 to-purple-700 text-white"
            disabled={!isInStock}
            onClick={
              setSelectedItem && setBuyModalOpen
                ? () => {
                    setSelectedItem({
                      name: title,
                      price: vehicle.price,
                      image_url: vehicle.image_url,
                    });
                    setBuyModalOpen(true);
                  }
                : undefined
            }
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
