
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Bike, Package, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleCard from '@/components/VehicleCard';
import AccessoryCard from '@/components/AccessoryCard';
import { Vehicle, Accessory } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [featuredAccessories, setFeaturedAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);
      
      // Fetch featured vehicles (cars and bikes)
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('products')
        .select('*')
        .in('category', ['car', 'bike'])
        .eq('featured', true)
        .eq('available', true)
        .limit(6);

      if (vehicleError) {
        console.error('Error fetching vehicles:', vehicleError);
        toast({
          title: "Error",
          description: "Failed to load vehicles",
          variant: "destructive",
        });
      } else {
        // Transform the data to match our Vehicle type
        const transformedVehicles: Vehicle[] = vehicleData?.map(item => ({
          id: item.id.toString(),
          title: item.name,
          type: item.category as 'car' | 'bike',
          price: Number(item.price),
          year: item.year || 2023,
          fuel: item.fuel as 'Petrol' | 'Diesel' | 'Electric' | 'CNG' || 'Petrol',
          transmission: item.transmission as 'Manual' | 'Automatic' || 'Manual',
          image: item.image_url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500',
          location: item.location || 'India',
          mileage: item.mileage,
          brand: item.brand,
          model: item.model,
          featured: item.featured,
          description: item.description
        })) || [];
        
        setFeaturedVehicles(transformedVehicles);
      }

      // Fetch featured accessories
      const { data: accessoryData, error: accessoryError } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'accessory')
        .eq('featured', true)
        .eq('available', true)
        .limit(3);

      if (accessoryError) {
        console.error('Error fetching accessories:', accessoryError);
        toast({
          title: "Error",
          description: "Failed to load accessories",
          variant: "destructive",
        });
      } else {
        // Transform the data to match our Accessory type
        const transformedAccessories: Accessory[] = accessoryData?.map(item => ({
          id: item.id.toString(),
          title: item.name,
          price: Number(item.price),
          category: item.type as 'Interior' | 'Exterior' | 'Electronics' | 'Maintenance' | 'Safety' || 'Interior',
          image: item.image_url || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500',
          rating: 4.5, // Default rating since we don't have ratings in DB yet
          description: item.description,
          brand: item.brand,
          inStock: item.available && item.stock > 0
        })) || [];
        
        setFeaturedAccessories(transformedAccessories);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load featured items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const heroFeatures = [
    {
      icon: Car,
      title: 'Premium Cars',
      description: 'Find your dream car from verified dealers'
    },
    {
      icon: Bike,
      title: 'Best Bikes',
      description: 'Explore motorcycles and scooters'
    },
    {
      icon: Package,
      title: 'Accessories',
      description: 'Complete range of auto accessories'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 text-balance">
              Find Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Vehicle</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover thousands of cars, bikes, and accessories from trusted dealers across India
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link to="/vehicles" className="flex items-center gap-2">
                  Browse Vehicles <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link to="/accessories">Shop Accessories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 -mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {heroFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Vehicles</h2>
            <p className="text-xl text-gray-600">Hand-picked premium vehicles just for you</p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4" />
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Button size="lg" variant="outline">
              <Link to="/vehicles">View All Vehicles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Accessories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Accessories</h2>
            <p className="text-xl text-gray-600">Premium accessories for your vehicle</p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4" />
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredAccessories.map((accessory) => (
                <AccessoryCard key={accessory.id} accessory={accessory} />
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Button size="lg" variant="outline">
              <Link to="/accessories">Shop All Accessories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Vehicles Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Trusted Dealers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
