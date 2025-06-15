import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Menu, X, ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/hooks/useWishlist";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { getCartCount } = useCart();
  const { wishlistItems, loading: wishlistLoading } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 text-white shadow border-b border-gray-900 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AutoMart</span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-7">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link to="/vehicles" className="hover:text-blue-400 transition-colors">Vehicles</Link>
            <Link to="/accessories" className="hover:text-blue-400 transition-colors">Accessories</Link>
            <Link to="/about" className="hover:text-blue-400 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
          </div>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="sm" className="text-blue-300 hover:bg-gray-900">
                <Heart className="h-5 w-5" />
                {!wishlistLoading && wishlistItems.length > 0 && (
                  <Badge variant="error" className="absolute -top-1.5 -right-1.5 select-none">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-blue-300 hover:bg-gray-900">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-gray-900">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-blue-700 to-purple-700 text-white">Sign In</Button>
              </Link>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-400 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-950 border-t border-gray-800">
              <Link to="/" className="block px-3 py-2 hover:text-blue-400" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/vehicles" className="block px-3 py-2 hover:text-blue-400" onClick={() => setIsOpen(false)}>Vehicles</Link>
              <Link to="/accessories" className="block px-3 py-2 hover:text-blue-400" onClick={() => setIsOpen(false)}>Accessories</Link>
              <Link to="/about" className="block px-3 py-2 hover:text-blue-400" onClick={() => setIsOpen(false)}>About</Link>
              <Link to="/contact" className="block px-3 py-2 hover:text-blue-400" onClick={() => setIsOpen(false)}>Contact</Link>
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex gap-2 items-center justify-around">
                  <Link to="/wishlist" className="relative">
                    <Button variant="ghost" size="sm" className="text-blue-300">
                      <Heart className="h-5 w-5" />
                      {!wishlistLoading && wishlistItems.length > 0 && (
                        <Badge variant="error" className="absolute -top-1.5 -right-1.5 select-none">
                          {wishlistItems.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="text-blue-300">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  {user ? (
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Link to="/auth">
                      <Button className="w-full bg-gradient-to-r from-blue-700 to-purple-700 text-white">Sign In</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
