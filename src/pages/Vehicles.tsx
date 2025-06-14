
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import FiltersPanel from '@/components/FiltersPanel';
import { toast } from 'sonner';

const Vehicles = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 2000000],
    brand: '',
    fuel: '',
    transmission: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .in('category', ['car', 'bike']);

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }
      if (filters.fuel) {
        query = query.eq('fuel', filters.fuel);
      }
      if (filters.transmission) {
        query = query.eq('transmission', filters.transmission);
      }

      query = query
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1])
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Vehicles 🚗🏍️</h1>
          <p className="text-gray-600">Find your perfect vehicle from our extensive collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <FiltersPanel filters={filters} onFiltersChange={setFilters} />
          </div>
          
          <div className="lg:w-3/4">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">No vehicles found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
