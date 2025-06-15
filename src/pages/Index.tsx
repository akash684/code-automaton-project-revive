
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
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-[#181b20] to-gray-950 min-h-screen text-white transition-colors duration-300">
      <Navbar onToggleDark={() => document.documentElement.classList.toggle('dark')} />
      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.section
          className="relative flex flex-col md:flex-row items-center min-h-[75vh] py-8 md:py-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="md:w-1/2 w-full z-20 flex flex-col items-start justify-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight drop-shadow" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>
              Drive Your Dream <span className="text-blue-400">—</span>
              <br />
              <span className="block font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Rent or Own, the Smart Way</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8">India’s #1 platform for cars, bikes, and the rides you love—buy, rent, or accessorize in seconds.</p>
            <div className="flex gap-4">
              <Link to="/vehicles">
                <Button size="lg" className="bg-gradient-to-r from-blue-700 to-purple-600 shadow-xl px-8 py-4 font-bold rounded-xl">
                  Browse Vehicles
                </Button>
              </Link>
              <Link to="/accessories">
                <Button size="lg" variant="outline" className="border-white/60 bg-white/10 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-white/20">
                  Explore Accessories
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 w-full flex items-center justify-center mt-10 md:mt-0">
            <div className="relative w-full max-w-[520px] md:max-w-[550px] bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 glass morph">
              <img
                src={heroBg}
                alt="Luxury black car, book a test drive"
                className="rounded-3xl w-full shadow-2xl object-cover"
                style={{ minHeight: 260, background: "rgba(32,32,32,0.3)" }}
              />
              <div className="absolute inset-0 rounded-3xl bg-black/40 pointer-events-none" />
            </div>
          </div>
        </motion.section>

        {/* Why Choose Us grid */}
        <section className="py-16">
          <div>
            <h2 className="text-4xl font-bold text-center mb-14 drop-shadow">Why Choose AutoMart? 🏆</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="bg-white/10 dark:bg-[#161a23]/40 backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center p-7 glass">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <Truck className="w-10 h-10 text-blue-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">Fast Delivery</h3>
                  <p className="text-slate-300 text-sm">Doorstep delivery across India</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 dark:bg-[#161a23]/40 backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center p-7 glass">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <Shield className="w-10 h-10 text-green-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">Verified Quality</h3>
                  <p className="text-slate-300 text-sm">All vehicles checked and certified</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 dark:bg-[#161a23]/40 backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center p-7 glass">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <Clock className="w-10 h-10 text-purple-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">24/7 Support</h3>
                  <p className="text-slate-300 text-sm">Always-on customer support</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 dark:bg-[#161a23]/40 backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center p-7 glass">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <Users className="w-10 h-10 text-orange-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">Trusted by Thousands</h3>
                  <p className="text-slate-300 text-sm">Join our happy customers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Cars */}
        <section className="py-14">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold drop-shadow">Featured Cars 🚗</h2>
            <Link to="/vehicles">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {getProductsByCategory('car').map((product) => (
              <Card key={product.id} className="group overflow-hidden bg-gradient-to-br from-white/5 to-black/10 dark:from-[#191a23]/70 dark:to-black/30 backdrop-blur-2xl border border-white/10 shadow-xl hover:scale-105 transition-transform glass">
                <div className="relative">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
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
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {formatPrice(Number(product.price))}
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
        </section>

        {/* Featured Bikes */}
        <section className="py-14">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold drop-shadow">Featured Bikes 🏍️</h2>
            <Link to="/vehicles">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {getProductsByCategory('bike').map((product) => (
              <Card key={product.id} className="group overflow-hidden bg-gradient-to-br from-white/5 to-black/10 dark:from-[#191a23]/70 dark:to-black/30 backdrop-blur-2xl border border-white/10 shadow-xl hover:scale-105 transition-transform glass">
                <div className="relative">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
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
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {formatPrice(Number(product.price))}
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
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 drop-shadow">What Our Customers Say 💬</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
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
                <Card key={t.name} className="bg-white/10 dark:bg-[#23263b]/40 backdrop-blur-lg border-none shadow-lg hover:shadow-2xl transition-shadow text-left flex flex-col p-7 glass">
                  <CardContent className="p-0 flex flex-col flex-1">
                    <div className="flex items-center justify-center mb-4 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-200 mb-4 text-base">
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
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-5 drop-shadow">Ready to Find Your Perfect Vehicle? 🚀</h2>
            <p className="text-lg mb-8 text-blue-100">
              Join thousands of satisfied customers who found their dream vehicles with us.
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
      </main>
    </div>
  );
};

export default Index;
