import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accessory } from '@/types';

interface AccessoryCardProps {
  accessory: Accessory;
}

const AccessoryCard = ({ accessory }: AccessoryCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group bg-card text-foreground border rounded-2xl">
      <div className="relative overflow-hidden">
        <img
          src={accessory.image}
          alt={accessory.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-accent text-background">{accessory.category}</Badge>
        </div>
        {!accessory.inStock && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur flex items-center justify-center">
            <Badge variant="error" className="text-background">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{accessory.rating}</span>
          </div>
          {accessory.brand && (
            <Badge variant="outline" className="text-xs">
              {accessory.brand}
            </Badge>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{accessory.title}</h3>
        
        {accessory.description && (
          <p className="text-muted text-sm mb-4 line-clamp-2">{accessory.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-accent">
            {formatPrice(accessory.price)}
          </div>
          <Button 
            size="sm" 
            disabled={!accessory.inStock}
            className="bg-accent text-background hover:bg-accent/90"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessoryCard;
