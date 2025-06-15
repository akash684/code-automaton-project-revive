import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  fuelOptions,
  transmissionOptions,
  categoryOptions,
  CategoryOption,
  BrandOption,
  FuelOption,
  TransmissionOption,
  FuelType,
  TransmissionType,
} from "@/constants/options";

type FilterPanelProps = {
  brands: string[]; // We'll convert to BrandOption[] below
  categories?: string[];
  filters: any; // Consider stricter typing in future cleanup
  onChange: (f: any) => void;
  minPrice?: number;
  maxPrice?: number;
  fuelTypes?: string[]; // We use static from constants, but kept for compatibility
  transmissionTypes?: string[];
  withCategory?: boolean;
};

export function FilterPanel({
  brands,
  categories,
  filters,
  onChange,
  minPrice = 50000,
  maxPrice = 2000000,
  fuelTypes,
  transmissionTypes,
  withCategory
}: FilterPanelProps) {
  // Convert all to label/value
  const filteredBrands: BrandOption[] = (brands || [])
    .filter(b => typeof b === "string" && b.trim().length > 0)
    .map(b => ({ value: b, label: b }));

  const filteredCategories: CategoryOption[] = (categories || [])
    .filter(c => typeof c === "string" && c.trim().length > 0)
    .map(c => ({ value: c, label: c }));

  // We always use our local constants for fuel/transmission
  const filteredFuelTypes: FuelOption[] =
    (fuelTypes && fuelTypes.length
      ? fuelTypes.filter(f => typeof f === "string" && f.trim().length > 0).map(f => {
          const lower = f.toLowerCase();
          return { value: lower as FuelType, label: f.charAt(0).toUpperCase() + f.slice(1).toLowerCase() };
        })
      : fuelOptions);

  const filteredTransmissionTypes: TransmissionOption[] =
    (transmissionTypes && transmissionTypes.length
      ? transmissionTypes.filter(t => typeof t === "string" && t.trim().length > 0).map(t => {
          const lower = t.toLowerCase();
          return { value: lower as TransmissionType, label: t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() };
        })
      : transmissionOptions);

  // Convenience for resetting to placeholder
  const handleSelect = (key: string, v: string) => {
    onChange({ ...filters, [key]: v });
  };

  return (
    <div className="space-y-6 p-4">
      {withCategory && filteredCategories.length > 0 && (
        <div>
          <div className="font-medium mb-1">Category</div>
          <Select
            value={filters.category ?? undefined}
            onValueChange={v => handleSelect('category', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map(opt => (
                <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredBrands.length > 0 && (
        <div>
          <div className="font-medium mb-1">Brand</div>
          <Select
            value={filters.brand ?? undefined}
            onValueChange={v => handleSelect('brand', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              {filteredBrands.map(opt => (
                <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredFuelTypes.length > 0 && (
        <div>
          <div className="font-medium mb-1">Fuel</div>
          <Select
            value={filters.fuel ?? undefined}
            onValueChange={v => handleSelect('fuel', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Fuels" />
            </SelectTrigger>
            <SelectContent>
              {filteredFuelTypes.map(opt => (
                <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredTransmissionTypes.length > 0 && (
        <div>
          <div className="font-medium mb-1">Transmission</div>
          <Select
            value={filters.transmission ?? undefined}
            onValueChange={v => handleSelect('transmission', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {filteredTransmissionTypes.map(opt => (
                <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <div className="font-medium mb-1">Price</div>
        <Slider
          min={minPrice}
          max={maxPrice}
          step={5000}
          value={filters.priceRange}
          onValueChange={pr => onChange({ ...filters, priceRange: pr })}
        />
        <div className="flex justify-between text-xs mt-1">
          <span>₹{filters.priceRange[0]}</span>
          <span>₹{filters.priceRange[1]}</span>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() =>
          onChange({
            brand: undefined,
            fuel: undefined,
            priceRange: [minPrice, maxPrice],
            transmission: undefined,
            category: undefined
          })
        }
      >
        Reset Filters
      </Button>
    </div>
  );
}
