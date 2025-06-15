
// FilterPanel works for both vehicles and accessories, with generic options arrays
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

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
}: {
  brands?: string[];
  categories?: string[];
  fuelTypes?: string[];
  transmissionTypes?: string[];
  filters: any;
  onChange: (f: any) => void;
  minPrice?: number;
  maxPrice?: number;
  withCategory?: boolean;
}) {
  const handleSelect = (key: string, v: string | undefined) => {
    onChange({ ...filters, [key]: v });
  };
  // Convert string arrays to value-label
  const optionize = (arr?: string[]) => (arr || []).map(b => ({ value: b, label: b }));

  return (
    <div className="space-y-6 p-4">
      {withCategory && optionize(categories).length > 0 && (
        <div>
          <div className="font-medium mb-1">Category</div>
          <Select
            value={filters.category || ""}
            onValueChange={v => handleSelect("category", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {optionize(categories).map(opt => (
                <SelectItem value={opt.value} key={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {optionize(brands).length > 0 && (
        <div>
          <div className="font-medium mb-1">Brand</div>
          <Select
            value={filters.brand || ""}
            onValueChange={v => handleSelect("brand", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              {optionize(brands).map(opt => (
                <SelectItem value={opt.value} key={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {optionize(fuelTypes).length > 0 && (
        <div>
          <div className="font-medium mb-1">Fuel</div>
          <Select
            value={filters.fuel || ""}
            onValueChange={v => handleSelect("fuel", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Fuels" />
            </SelectTrigger>
            <SelectContent>
              {optionize(fuelTypes).map(opt => (
                <SelectItem value={opt.value} key={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {optionize(transmissionTypes).length > 0 && (
        <div>
          <div className="font-medium mb-1">Transmission</div>
          <Select
            value={filters.transmission || ""}
            onValueChange={v => handleSelect("transmission", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {optionize(transmissionTypes).map(opt => (
                <SelectItem value={opt.value} key={opt.value}>
                  {opt.label}
                </SelectItem>
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
          step={1000}
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
            brand: "",
            fuel: "",
            priceRange: [minPrice, maxPrice],
            transmission: "",
            category: ""
          })
        }
      >
        Reset Filters
      </Button>
    </div>
  );
}
