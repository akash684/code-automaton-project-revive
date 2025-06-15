import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, ArrowRight, Truck, Shield, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from "framer-motion";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white transition-colors duration-300">
      {/* Removed local Navbar to fix double nav bar issue */}
      {/* <Navbar onToggleDark={() => {}} /> */}
      <main className="container mx-auto px-4">
        {/* Hero Section (Image removed, only dark background + text/buttons) */}
        <motion.section
          className="relative flex flex-col items-center min-h-[60vh] py-12 md:py-20 bg-gradient-to-br from-gray-900 via-[#17181b] to-gray-950 rounded-3xl shadow"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="z-20 flex flex-col items-center justify-center max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight drop-shadow text-center" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>
              Drive Your Dream <span className="text-blue-400">—</span>
              <br />
              <span className="block font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Rent or Own, the Smart Way</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 text-center">India’s #1 platform for cars, bikes, and the rides you love—buy, rent, or accessorize in seconds.</p>
            <div className="flex gap-4 flex-col sm:flex-row items-center">
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
        </motion.section>
        {/* Why Choose Us grid */}
        <section className="py-16">
          <div>
            <h2 className="text-4xl font-bold text-center mb-14 drop-shadow">Why Choose AutoMart? 🏆</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="bg-[#1a1d24] backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center p-7">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <Truck className="w-10 h-10 text-blue-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">Fast Delivery</h3>
                  <p className="text-slate-300 text-sm">Doorstep delivery across India</p>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1d24] backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center p-7">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <Shield className="w-10 h-10 text-green-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">Verified Quality</h3>
                  <p className="text-slate-300 text-sm">All vehicles checked and certified</p>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1d24] backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center p-7">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <Clock className="w-10 h-10 text-purple-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">24/7 Support</h3>
                  <p className="text-slate-300 text-sm">Always-on customer support</p>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1d24] backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center p-7">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <Users className="w-10 h-10 text-orange-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">Trusted by Thousands</h3>
                  <p className="text-slate-300 text-sm">Join our happy customers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Popular Vehicle Brands Section */}
        <section className="py-10">
          <h3 className="text-2xl font-bold mb-6 drop-shadow text-center">Popular Vehicle Brands</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {["Maruti", "Tata", "Hyundai", "Toyota", "Honda", "Kia", "Suzuki", "Royal Enfield", "Yamaha", "Bajaj"].map((brand) => (
              <div
                key={brand}
                className="bg-[#22252d] text-white px-5 py-2 rounded-full shadow border border-white/10 text-base font-semibold hover:scale-105 transition"
              >
                {brand}
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 max-w-2xl mx-auto">We partner with leading car and bike manufacturers to bring you the widest range of vehicles. Filter by your favorite brand to find your dream ride!</p>
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
                <Card key={t.name} className="bg-[#191b29] backdrop-blur-lg border-none shadow-lg hover:shadow-2xl transition-shadow text-left flex flex-col p-7">
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
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-[#1b2333] text-white">
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
