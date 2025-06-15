
/** Option types and option arrays for Select fields */

export type CategoryOption = { value: string; label: string };
export type BrandOption = { value: string; label: string };
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'cng';
export type FuelOption = { value: FuelType; label: string };
export type TransmissionType = 'manual' | 'automatic';
export type TransmissionOption = { value: TransmissionType; label: string };

// These can/should be driven from API but here's a static baseline

export const categoryOptions: CategoryOption[] = [
  { value: 'car', label: 'Car' },
  { value: 'bike', label: 'Bike' },
];

export const fuelOptions: FuelOption[] = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'cng', label: 'CNG' },
];

export const transmissionOptions: TransmissionOption[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
];

