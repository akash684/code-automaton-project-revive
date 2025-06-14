
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
    const success = await addToCart(product.id);
    if (success) {
      toast.success('Added to cart!');
    }
  };

  const handleWishlistToggle = async () => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Button 
            size="sm" 
            variant="ghost" 
            className={`bg-white/90 hover:bg-white ${isWishlisted ? 'text-red-500' : ''}`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
        </div>
        {product.featured && (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600">
            Featured
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          {product.category && <Badge variant="outline">{product.category}</Badge>}
          {product.brand && <Badge variant="outline">{product.brand}</Badge>}
          {product.year && <Badge variant="outline">{product.year}</Badge>}
          {product.fuel && <Badge variant="outline">{product.fuel}</Badge>}
        </div>
        <div className="text-2xl font-bold text-green-600 mb-4">
          {formatPrice(product.price)}
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
