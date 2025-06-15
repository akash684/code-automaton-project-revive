import React, { useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Eye, Trash2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { WishlistItemCard } from "@/components/WishlistItemCard";

type ViewType = "grid" | "list";
type SortType = "date" | "price" | "stock" | "brand";

const badgeClasses = (inStock: boolean) =>
  cn(
    "px-3 py-0.5 text-xs font-bold rounded-full border",
    inStock
      ? "bg-green-600 text-white border-green-500"
      : "bg-slate-700 text-slate-300 border-slate-600"
  );

const getRatingStars = (rating: number | undefined) => {
  const stars = [];
  if (!rating) return null;
  for (let i = 1; i <= 5; ++i) {
    stars.push(
      <Star
        key={i}
        size={16}
        fill={i <= rating ? "#fbbf24" : "none"}
        color="#fbbf24"
        className={i <= rating ? "" : "opacity-30"}
      />
    );
  }
  return <div className="flex items-center gap-0.5 mt-1">{stars}</div>;
};

const getDisplayCategory = (item: any) =>
  item.product?.category ||
  item.product?.type ||
  item.category ||
  item.item_type ||
  "Misc";

const getPrice = (item: any) =>
  typeof item.product?.price === "number"
    ? item.product.price
    : typeof item.price === "number"
    ? item.price
    : undefined;

export default function WishlistPage() {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const [view, setView] = useState<ViewType>("grid");
  const [sort, setSort] = useState<SortType>("date");
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Sorting
  const sortedItems = [...wishlistItems].sort((a, b) => {
    if (sort === "price") {
      const aPrice = getPrice(a) || 0;
      const bPrice = getPrice(b) || 0;
      return aPrice - bPrice;
    } else if (sort === "stock") {
      const aStock = (a.product?.in_stock ?? a.product?.available ?? true) ? 1 : 0;
      const bStock = (b.product?.in_stock ?? b.product?.available ?? true) ? 1 : 0;
      return bStock - aStock;
    } else if (sort === "brand") {
      return (a.product?.brand || "").localeCompare(b.product?.brand || "");
    }
    // Default - by created_at descending (most recent first)
    return (b.created_at || "").localeCompare(a.created_at || "");
  });

  // Grouping by category (bonus)
  const [groupByCategory, setGroupByCategory] = useState(false);

  // Utility for animation
  const removeItem = async (id: string, itemId: number | string) => {
    setRemovingId(id);
    setTimeout(async () => {
      await removeFromWishlist(itemId);
      setRemovingId(null);
    }, 350); // Animation duration
  };

  // Responsive columns (grid vs list switch)
  const gridCols =
    view === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      : "flex flex-col gap-4";

  // Map for grouping (category label -> WishlistItem[])
  const grouped =
    groupByCategory && sortedItems.length > 0
      ? sortedItems.reduce<Record<string, typeof sortedItems>>((acc, item) => {
          const cat = getDisplayCategory(item);
          acc[cat] = acc[cat] || [];
          acc[cat].push(item);
          return acc;
        }, {})
      : {};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-lg text-slate-400 animate-pulse">Loading your wishlist...</div>
      </div>
    );
  }

  // --- Empty State ---
  if (wishlistItems.length === 0) {
    return (
      <section className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center">
          <div className="bg-slate-800 rounded-full p-6 shadow-lg mb-4 animate-fade-in">
            <Heart className="w-16 h-16 text-pink-500" fill="#ec4899" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-4">
            Your wishlist is empty.
          </div>
          <div className="mb-6 text-slate-400 max-w-md text-center">
            Add products, vehicles, and accessories you love. They'll appear here for easy access!
          </div>
          <div className="flex gap-3">
            <Link to="/accessories">
              <Button className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold shadow-lg">
                Browse Accessories
              </Button>
            </Link>
            <Link to="/vehicles">
              <Button variant="outline" className="border-fuchsia-600 text-fuchsia-400 hover:bg-slate-800">
                Explore Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // --- Wishlist View ---
  return (
    <section className="min-h-screen bg-slate-900 py-10 px-2 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-2 mb-2 md:mb-0">
            <Heart className="w-8 h-8 text-pink-600" fill="#ec4899" />
            My Wishlist
            <span className="ml-2 text-sm bg-gray-700 text-gray-200 rounded-full px-3 py-1">{wishlistItems.length}</span>
          </h1>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex rounded-lg bg-slate-800 p-1">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                className={cn("rounded-lg", view === "grid" && "bg-gradient-to-tr from-cyan-500 to-fuchsia-600 text-white")}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <svg width={20} height={20} fill="none" viewBox="0 0 20 20">
                  <rect x={2.5} y={2.5} width={6} height={6} rx={2} fill="currentColor" />
                  <rect x={11.5} y={2.5} width={6} height={6} rx={2} fill="currentColor" />
                  <rect x={2.5} y={11.5} width={6} height={6} rx={2} fill="currentColor" />
                  <rect x={11.5} y={11.5} width={6} height={6} rx={2} fill="currentColor" />
                </svg>
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                className={cn("rounded-lg", view === "list" && "bg-gradient-to-tr from-cyan-500 to-fuchsia-600 text-white")}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <svg width={20} height={20} fill="none" viewBox="0 0 20 20">
                  <rect x={3} y={4} width={14} height={3} rx={1.5} fill="currentColor" />
                  <rect x={3} y={9} width={14} height={3} rx={1.5} fill="currentColor" />
                  <rect x={3} y={14} width={14} height={3} rx={1.5} fill="currentColor" />
                </svg>
              </Button>
            </div>
            <Button
              size="sm"
              variant={groupByCategory ? "secondary" : "ghost"}
              className={cn("rounded-lg px-4", groupByCategory && "bg-gradient-to-tr from-fuchsia-700 to-cyan-700 text-white")}
              onClick={() => setGroupByCategory((v) => !v)}
            >
              {groupByCategory ? "Ungroup" : "Group by Category"}
            </Button>
            <select
              className="bg-slate-800 text-slate-200 px-3 py-2 rounded-lg border border-slate-600"
              value={sort}
              onChange={e => setSort(e.target.value as SortType)}
              aria-label="Sort wishlist"
            >
              <option value="date">Sort: Date Added</option>
              <option value="price">Sort: Price</option>
              <option value="stock">Sort: Stock</option>
              <option value="brand">Sort: Brand</option>
            </select>
          </div>
        </header>
        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
          {wishlistItems.map((item) => (
            <WishlistItemCard key={item.id} item={item} view={view} />
          ))}
        </div>
      </div>
    </section>
  );
}
