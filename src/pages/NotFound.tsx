import React, { useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Eye, Trash2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
        {/* Header controls */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-2 mb-2 md:mb-0">
            <Heart className="w-8 h-8 text-pink-600" fill="#ec4899" />
            My Wishlist
            <span className="ml-2 text-sm bg-gray-700 text-gray-200 rounded-full px-3 py-1">{wishlistItems.length}</span>
          </h1>
          <div className="flex flex-wrap gap-3 items-center">
            {/* View Toggle */}
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
            {/* Grouping toggle */}
            <Button
              size="sm"
              variant={groupByCategory ? "secondary" : "ghost"}
              className={cn("rounded-lg px-4", groupByCategory && "bg-gradient-to-tr from-fuchsia-700 to-cyan-700 text-white")}
              onClick={() => setGroupByCategory((v) => !v)}
            >
              {groupByCategory ? "Ungroup" : "Group by Category"}
            </Button>
            {/* Sort By */}
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

        {/* Wishlist List/Group/Grid */}
        {groupByCategory && Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-9">
              <div className="text-lg font-bold text-fuchsia-400 mb-4">{category}</div>
              <div className={gridCols}>
                <AnimatePresence>
                  {items.map((item) => (
                    <WishlistCard
                      key={item.id}
                      item={item}
                      view={view}
                      removing={removingId === item.id}
                      onRemove={() => removeItem(item.id, item.product_id ?? item.item_uuid)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        ) : (
          <div className={gridCols}>
            <AnimatePresence>
              {sortedItems.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  view={view}
                  removing={removingId === item.id}
                  onRemove={() => removeItem(item.id, item.product_id ?? item.item_uuid)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

// ---- Card Component for a Wishlist Item ----
function WishlistCard({
  item,
  view,
  removing,
  onRemove,
}: {
  item: any;
  view: ViewType;
  removing: boolean;
  onRemove: () => void;
}) {
  // Enhanced price extraction: fallback for all types
  let image =
    item.product?.image_url ||
    item.image_url ||
    item.image ||
    "/placeholder.svg";
  let title =
    item.product?.name ||
    item.title ||
    (item.brand && item.model
      ? `${item.brand} ${item.model}`
      : "") ||
    item.brand ||
    item.name ||
    "Item";
  
  // Compute, fallback to any "price" available
  let price =
    typeof item.product?.price === "number"
      ? item.product.price
      : typeof item.price === "number"
      ? item.price
      : typeof item.product?.price_inr === "number"
      ? item.product.price_inr
      : typeof item.price_inr === "number"
      ? item.price_inr
      : undefined;

  let stock =
    item.product?.in_stock ??
    item.product?.available ??
    item.available ??
    true;
  let category =
    item.product?.category ||
    item.category ||
    item.product?.type ||
    item.type ||
    (item.item_type === "vehicle"
      ? "Vehicle"
      : item.item_type === "accessory"
      ? "Accessory"
      : "Misc");
  let rating = item.product?.rating || item.rating || undefined;
  let brand = item.product?.brand || item.brand || undefined;

  // Always valid URLs for details
  let detailsLink =
    item.item_type === "product"
      ? `/products/${item.product?.slug ?? item.product_id ?? item.id ?? ""}`
      : item.item_type === "vehicle"
      ? `/vehicles/${item.item_uuid ?? item.id ?? ""}`
      : item.item_type === "accessory"
      ? `/accessories/${item.item_uuid ?? item.id ?? ""}`
      : "#";

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: {
      opacity: 0,
      y: 60,
      scale: 0.95,
      transition: { duration: 0.35 },
    },
  };

  // Responsive/variant styles
  const cardStyles =
    view === "grid"
      ? "rounded-2xl shadow-xl bg-slate-800/90 border border-slate-700 hover:shadow-2xl ring-1 ring-transparent hover:ring-fuchsia-600 transition-all duration-150 flex flex-col min-h-[420px] relative"
      : "rounded-xl shadow-lg bg-slate-800/95 border border-slate-700 flex flex-row items-center gap-4 p-3 min-h-[110px] hover:ring-2 hover:ring-fuchsia-500 relative";

  // Image box, new: works for all types
  const imageBox =
    <div className={cn(
      "bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center transition-transform duration-300 relative",
      view === "grid" ? "h-44 w-full mb-3" : "h-24 w-24 mr-5"
    )}>
      <img
        src={image}
        alt={title}
        className={cn("object-cover transition-transform duration-300 hover:scale-110", view === "grid" ? "w-full h-full" : "h-full w-full")}
        loading="lazy"
      />
      {/* Stock Badge */}
      <span className={cn(badgeClasses(stock), "absolute top-2 left-2 z-10")}>
        {stock ? "In Stock" : "Out of Stock"}
      </span>
    </div>;

  // Modern tags / chips builder
  const tags = (
    <div className="flex flex-wrap gap-1 text-xs text-slate-400 mb-1">
      {category && (
        <span className="bg-slate-700 rounded-full px-2 py-0.5">
          {category}
        </span>
      )}
      {brand && (
        <span className="border border-slate-600 rounded-full px-2 py-0.5">
          {brand}
        </span>
      )}
      {item.product?.type && !item.product?.category && (
        <span className="bg-slate-700 rounded-full px-2 py-0.5">
          {item.product?.type}
        </span>
      )}
    </div>
  );

  // Responsive action buttons, visible for all
  const actions = (
    <div className="flex flex-wrap gap-2 mt-auto">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Remove"
        className="hover:bg-pink-900/60 text-pink-400"
        onClick={onRemove}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
      <Link to={detailsLink}>
        <Button
          variant="outline"
          size="sm"
          className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/30"
        >
          <Eye className="w-4 h-4 mr-2" />
          {view === "grid" ? "View Details" : "Details"}
        </Button>
      </Link>
      <Button
        variant="secondary"
        size="sm"
        className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-bold hover:from-cyan-500 hover:to-fuchsia-500"
        disabled={!stock}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {stock ? (view === "grid" ? "Buy Now" : "Buy") : "Unavailable"}
      </Button>
    </div>
  );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={cardVariants}
      layout
      className={cardStyles}
      style={removing ? { pointerEvents: "none", opacity: 0.6 } : {}}
    >
      {view === "grid" ? (
        <>
          {imageBox}
          <div className="flex-1 flex flex-col gap-1 px-2 pb-2">
            <Link
              to={detailsLink}
              className="hover:text-cyan-400 text-lg font-bold text-white mb-0.5 line-clamp-2"
            >
              {title}
            </Link>
            {tags}
            <div className="flex items-center gap-2 mb-1 mt-2">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-transparent bg-clip-text">
                ₹{price !== undefined ? new Intl.NumberFormat("en-IN").format(price) : "--"}
              </span>
              {getRatingStars(rating)}
            </div>
            {actions}
          </div>
        </>
      ) : (
        <>
          {imageBox}
          <div className="flex flex-1 flex-col gap-1">
            <Link to={detailsLink} className="hover:text-cyan-400 text-base font-bold text-white">
              {title}
            </Link>
            {tags}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-transparent bg-clip-text">
                ₹{price !== undefined ? new Intl.NumberFormat("en-IN").format(price) : "--"}
              </span>
              {getRatingStars(rating)}
            </div>
            <div className="flex gap-2 mt-2">{actions}</div>
          </div>
        </>
      )}
    </motion.div>
  );
}
