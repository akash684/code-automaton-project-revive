
import { Heart, ShoppingCart, Eye, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    await addToCart(product.id);
  };

  const handleWishlistToggle = async () => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const getDeliveryText = () => {
    const days = product.delivery_days || 7;
    return `${days} days delivery`;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleWishlistToggle}
            className={cn(
              "bg-white/90 hover:bg-white",
              isInWishlist(product.id) && "text-red-500"
            )}
          >
            <Heart className={cn("w-4 h-4", isInWishlist(product.id) && "fill-current")} />
          </Button>
          <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white">
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
              Featured
            </Badge>
          )}
          {!product.in_stock && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          {product.brand && (
            <Badge variant="outline" className="text-xs">
              {product.brand}
            </Badge>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <Truck className="w-4 h-4" />
          <span>{getDeliveryText()}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(product.price)}
          </div>
          {product.stock > 0 && (
            <div className="text-sm text-gray-500">
              {product.stock} in stock
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleAddToCart}
            disabled={!product.in_stock || product.stock === 0}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button 
            variant="outline" 
            className="px-6"
            disabled={!product.in_stock || product.stock === 0}
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
