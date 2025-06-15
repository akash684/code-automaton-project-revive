
import React from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { wishlistItems, loading } = useWishlist();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-gray-500">Loading your wishlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-2xl mx-auto bg-white rounded shadow p-8">
        <h1 className="flex items-center justify-center text-2xl md:text-3xl font-bold text-pink-600 mb-6 gap-2">
          <Heart fill="#ec4899" className="w-7 h-7 mr-1" /> Your Wishlist
        </h1>
        {wishlistItems.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="mb-4">Your wishlist is empty.</p>
            <Link to="/" className="inline-block">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {wishlistItems.map((item) => (
              <li key={item.id} className="py-4 flex items-center gap-4">
                {/* Show product image/name if available, fallback to generic */}
                {item.product?.image_url && (
                  <img
                    src={item.product.image_url}
                    alt={item.product.name || "Wishlist item"}
                    className="h-14 w-14 rounded object-cover border"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-800">
                    {item.product?.name || `Wishlist ${item.item_type}`}
                  </div>
                  <div className="text-sm text-gray-400 capitalize">{item.item_type}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotFound;
