import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, ArrowRight, Truck, Shield, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BrandDisplayText } from "@/components/BrandDisplayText";
import { BrandButton } from "@/components/BrandButton";
import { HomeHeroBg } from "@/components/HomeHeroBg";
import { Navbar } from "@/components/ui/navbar";
import { motion } from "framer-motion";

const heroBg =
  "/lovable-uploads/4605de8a-f1a2-408b-83a7-6687db4469f0.png"; // Reference image for now. Replace with production asset if needed.

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('available', true)
        .limit(6);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getProductsByCategory = (category: string) => {
    return featuredProducts.filter(product => product.category === category);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#181b20] to-gray-950 text-white transition-colors duration-300">
      <Navbar onToggleDark={() => document.documentElement.classList.toggle('dark')} />
      {/* Hero Section */}
      <motion.section
        className="relative flex flex-col md:flex-row items-center min-h-[80vh] container mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Left: Text + CTA */}
        <div className="md:w-1/2 w-full z-20 flex flex-col items-start justify-center py-20 md:py-0 px-2 md:px-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
              Powerful, Fun and <br />
              <span className="block font-black text-5xl md:text-6xl text-red-500 tracking-tighter mt-2 mb-2">
                FIERCE TO <span className="text-white">DRIVE</span>
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-200 mb-7 mt-2 font-medium drop-shadow">
              Real Poise, Real Power, Real Performance.
            </p>
            <Link to="/contact">
              <Button
                className="mt-2 bg-red-600 hover:bg-red-700 text-lg px-8 py-4 font-bold shadow-xl rounded-full"
                size="lg"
              >
                Book a Test Ride
              </Button>
            </Link>
          </div>
        </div>
        {/* Right: Car Image */}
        <div className="md:w-1/2 w-full flex items-center justify-center relative min-h-[300px]">
          <div className="relative w-full max-w-[520px] md:max-w-[550px]">
            <img
              src={heroBg}
              alt="Luxury black car, book a test drive"
              className="relative rounded-3xl w-full shadow-2xl md:shadow-3xl object-cover select-none"
              style={{ background: "rgba(32,32,32,0.4)" }}
            />
            {/* Optional Glass overlay */}
            <div className="absolute inset-0 rounded-3xl bg-black/40 backdrop-blur-sm pointer-events-none" />
          </div>
        </div>
        {/* (you may want to move hero graphics under a <HomeHeroBg /> if further reusing!) */}
      </motion.section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white drop-shadow">
            Why Choose AutoMart? 🏆
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {/* EACH CARD: glassmorphism and dark mode */}
            <Card className="text-center p-6 bg-white/10 dark:bg-[#161a23]/40 backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Truck className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Fast Delivery</h3>
                <p className="text-slate-300">Quick doorstep delivery across India</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-white/10 dark:bg-[#161a23]/40 backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Verified Quality</h3>
                <p className="text-slate-300">All vehicles verified and certified</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-white/10 dark:bg-[#161a23]/40 backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-800/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Clock className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">24/7 Support</h3>
                <p className="text-slate-300">Round the clock customer support</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-white/10 dark:bg-[#161a23]/40 backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-orange-800/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Trusted by Thousands</h3>
                <p className="text-slate-300">Join our satisfied customer family</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 px-4 bg-white/5 dark:bg-[#191a23]/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-white drop-shadow">Featured Cars 🚗</h2>
            <Link to="/vehicles">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {getProductsByCategory('car').map((product) => (
              <Card key={product.id} className="group overflow-hidden bg-gradient-to-br from-white/5 to-black/10 dark:from-[#191a23]/70 dark:to-black/30 backdrop-blur-2xl border border-white/10 shadow-xl hover:scale-105 transition-transform duration-300">
                {/* ... keep existing code (car image, heart btn, badge) ... */}
                <div className="relative">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="ghost" className="bg-black/40 hover:bg-black/60 border border-white/10 text-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  {product.featured && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="bg-black/40 border-white/30 text-white">{product.year}</Badge>
                    <Badge variant="outline" className="bg-black/40 border-white/30 text-white">{product.fuel}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-4">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-blue-700 to-purple-700 text-white border-0 shadow hover:scale-105 transition-transform">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bikes */}
      <section className="py-20 px-4 bg-white/5 dark:bg-[#191a23]/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-white drop-shadow">Featured Bikes 🏍️</h2>
            <Link to="/vehicles">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {getProductsByCategory('bike').map((product) => (
              <Card key={product.id} className="group overflow-hidden bg-gradient-to-br from-white/5 to-black/10 dark:from-[#191a23]/70 dark:to-black/30 backdrop-blur-2xl border border-white/10 shadow-xl hover:scale-105 transition-transform duration-300">
                {/* ... keep existing code (bike image, heart btn, badge) ... */}
                <div className="relative">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="ghost" className="bg-black/40 hover:bg-black/60 border border-white/10 text-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  {product.featured && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="bg-black/40 border-white/30 text-white">{product.brand}</Badge>
                    <Badge variant="outline" className="bg-black/40 border-white/30 text-white">{product.fuel}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-4">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-blue-700 to-purple-700 text-white border-0 shadow hover:scale-105 transition-transform">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-white/5 to-gray-700/10 dark:from-[#161a23]/60 dark:to-gray-900/30 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16 text-white drop-shadow">What Our Customers Say 💬</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[ // Card testimonials as glassmorphism ]
              {
                name: "Rahul Sharma", loc: "Mumbai", quote: "Amazing service! Got my dream bike delivered in just 10 days. Highly recommended!"
              },
              {
                name: "Priya Patel", loc: "Bangalore", quote: "Best car buying experience ever. No hassle, great prices, excellent support."
              },
              {
                name: "Amit Kumar", loc: "Delhi", quote: "Top quality accessories at unbeatable prices. Will definitely shop again!"
              }
            ].map((t, idx) => (
              <Card key={t.name} className="p-6 bg-white/10 dark:bg-[#23263b]/40 backdrop-blur-lg border-none shadow-lg hover:shadow-2xl transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-200 mb-4">
                    "{t.quote}"
                  </p>
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-slate-400">{t.loc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/80 to-purple-900/90 text-white backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 drop-shadow">Ready to Find Your Perfect Vehicle? 🚀</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers who found their dream vehicles with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/vehicles">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white/10 border-white/10 text-white">
                Browse Vehicles
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white text-lg px-8 py-4">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
