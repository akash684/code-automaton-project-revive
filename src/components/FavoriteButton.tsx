import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  itemId: number;
  size?: "sm" | "icon" | "default";
  className?: string;
  showText?: boolean;
  /** When true, disables button if not authenticated. Otherwise, prompts sign-in. */
  disableUnauth?: boolean;
};

export function FavoriteButton({
  itemId,
  size = "icon",
  className,
  showText = false,
  disableUnauth = false,
}: FavoriteButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isInWishlist(itemId);

  const isLegacyProduct = typeof itemId === "number" && Number.isInteger(itemId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLegacyProduct) {
      // Provide feedback to user and do nothing
      addToWishlist(itemId); // triggers toast/info
      return;
    }
    if (wishlisted) {
      await removeFromWishlist(itemId);
    } else {
      await addToWishlist(itemId);
    }
  };

  return (
    <Button
      size={size}
      variant="ghost"
      onClick={handleClick}
      aria-label={wishlisted ? "Remove from favourites" : "Add to favourites"}
      title={wishlisted ? "Remove from favourites" : "Add to favourites"}
      className={cn(
        "transition-colors border border-transparent",
        wishlisted
          ? "bg-pink-700 border-pink-400 text-white hover:bg-pink-800"
          : "bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800",
        className
      )}
      disabled={disableUnauth && !isLegacyProduct}
      type="button"
    >
      <Heart
        fill={wishlisted ? "#ec4899" : "none"}
        className={cn(size === "icon" ? "w-5 h-5" : "w-4 h-4")}
      />
      {showText && (
        <span className="ml-1">{wishlisted ? "Favourited" : "Favourite"}</span>
      )}
    </Button>
  );
}

export default FavoriteButton;
