
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type FilterPanelProps = {
  brands: string[];
  categories?: string[];
  filters: any;
  onChange: (f: any) => void;
  minPrice?: number;
  maxPrice?: number;
  fuelTypes?: string[];
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
  return (
    <div className="space-y-6 p-4">
      {withCategory && categories && (
        <div>
          <div className="font-medium mb-1">Category</div>
          <Select value={filters.category ?? ""} onValueChange={v => onChange({ ...filters, category: v })}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {categories.map(c => (<SelectItem value={c} key={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      )}
      {brands && (
        <div>
          <div className="font-medium mb-1">Brand</div>
          <Select value={filters.brand ?? ""} onValueChange={v => onChange({ ...filters, brand: v })}>
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {brands.map(b => (<SelectItem value={b} key={b}>{b}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      )}
      {fuelTypes && (
        <div>
          <div className="font-medium mb-1">Fuel</div>
          <Select value={filters.fuel ?? ""} onValueChange={v => onChange({ ...filters, fuel: v })}>
            <SelectTrigger>
              <SelectValue placeholder="All Fuels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {fuelTypes.map(f => (<SelectItem value={f} key={f}>{f}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      )}
      {transmissionTypes && (
        <div>
          <div className="font-medium mb-1">Transmission</div>
          <Select value={filters.transmission ?? ""} onValueChange={v => onChange({ ...filters, transmission: v })}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {transmissionTypes.map(tr => (<SelectItem value={tr} key={tr}>{tr}</SelectItem>))}
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
      <Button variant="outline" onClick={() =>
        onChange({
          brand: "",
          fuel: "",
          priceRange: [minPrice, maxPrice],
          transmission: "",
          category: ""
        })
      }>
        Reset Filters
      </Button>
    </div>
  );
}
