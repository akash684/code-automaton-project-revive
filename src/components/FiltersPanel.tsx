
import { useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

export interface Filters {
  category: string;
  priceRange: number[];
  brand: string;
  fuel: string;
  transmission: string;
}

interface FiltersPanelProps {
  filters: Filters;
  onFiltersChange: Dispatch<SetStateAction<Filters>>;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, onFiltersChange }) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const brands = ['Maruti Suzuki', 'Honda', 'Hyundai', 'Toyota', 'Royal Enfield', 'Bajaj', 'TVS'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked 
      ? [...selectedBrands, brand]
      : selectedBrands.filter(b => b !== brand);
    
    setSelectedBrands(newBrands);
    onFiltersChange(prev => ({ ...prev, brand: newBrands[0] || '' }));
  };

  const handleVehicleTypeChange = (value: string) => {
    onFiltersChange(prev => ({ ...prev, category: value === 'all' ? '' : value }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange(prev => ({ ...prev, priceRange: value }));
  };

  const handleFuelTypeChange = (value: string) => {
    onFiltersChange(prev => ({ ...prev, fuel: value === 'all' ? '' : value }));
  };

  const handleTransmissionChange = (value: string) => {
    onFiltersChange(prev => ({ ...prev, transmission: value === 'all' ? '' : value }));
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    onFiltersChange({
      category: '',
      priceRange: [100000, 2000000],
      brand: '',
      fuel: '',
      transmission: ''
    });
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
      {/* Vehicle Type */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Vehicle Type</label>
        <Select value={filters.category || 'all'} onValueChange={handleVehicleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="car">Cars</SelectItem>
            <SelectItem value="bike">Bikes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            max={3000000}
            min={50000}
            step={50000}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Fuel Type</label>
        <Select value={filters.fuel || 'all'} onValueChange={handleFuelTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Fuels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuels</SelectItem>
            <SelectItem value="petrol">Petrol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="electric">Electric</SelectItem>
            <SelectItem value="cng">CNG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Transmission</label>
        <Select value={filters.transmission || 'all'} onValueChange={handleTransmissionChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="automatic">Automatic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-end">
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear Filters
        </Button>
      </div>

      {/* Brands */}
      <div className="md:col-span-2 lg:col-span-5">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Brands</label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
              />
              <label
                htmlFor={brand}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
