
import React from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import type { WishlistItem } from "@/types"; // Fixed import

// badge utility for stock
const badgeClasses = (inStock: boolean) =>
  cn(
    "px-3 py-0.5 text-xs font-bold rounded-full border",
    inStock
      ? "bg-green-600 text-white border-green-500"
      : "bg-slate-700 text-slate-300 border-slate-600"
  );

export function getDetailPath(item: WishlistItem) {
  if (item.item_type === "vehicle") return `/vehicles/${item.item_uuid}`;
  if (item.item_type === "accessory") return `/accessories/${item.item_uuid}`;
  return `/products/${item.product_id ?? item.item_uuid}`;
}

interface WishlistItemCardProps {
  item: WishlistItem;
  view: "grid" | "list";
}

export const WishlistItemCard: React.FC<WishlistItemCardProps> = ({ item, view }) => {
  const navigate = useNavigate();
  const p = item.product;

  // fallback image
  const imageUrl = p?.image_url || "/placeholder.png";
  const inStock = p?.in_stock ?? true;

  return (
    <div
      className={cn(
        view === "grid"
          ? "rounded-2xl shadow-xl bg-slate-800/90 border border-slate-700 flex flex-col min-h-[420px] relative"
          : "rounded-xl shadow-lg bg-slate-800/95 border border-slate-700 flex flex-row items-center gap-4 p-3 min-h-[110px] relative"
      )}
      data-testid="wishlist-card"
    >
      {/* Image */}
      <div
        className={cn(
          "bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center relative",
          view === "grid" ? "h-44 w-full mb-3" : "h-24 w-24 mr-5"
        )}
      >
        <img
          src={imageUrl}
          alt={p?.name || "no-img"}
          className={cn(
            "object-cover transition-transform duration-300 hover:scale-110",
            view === "grid" ? "w-full h-full" : "h-full w-full"
          )}
        />
        <span className={cn(badgeClasses(!!inStock), "absolute top-2 left-2 z-10")}>
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      {/* Details */}
      <div className={cn("flex-1 flex flex-col gap-1", view === "grid" ? "px-2 pb-2" : "")}>
        <div className={cn(view === "grid" ? "text-lg" : "text-base", "font-bold text-white mb-0.5 line-clamp-2")}>
          {p?.name}
        </div>
        <div className="flex items-center gap-2 mb-1 mt-2">
          <p className="text-accent font-semibold">
            ₹{typeof p?.price === "number" ? p.price.toLocaleString("en-IN") : "--"}
          </p>
        </div>
        {/* Action */}
        <div className={cn("flex gap-2", view === "grid" ? "mt-auto" : "mt-2")}>
          <Button
            variant="outline"
            size="sm"
            className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/30"
            aria-label="Details"
            onClick={() => navigate(getDetailPath(item))}
            data-testid="details-btn"
          >
            <Eye className="w-4 h-4 mr-1" />
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

