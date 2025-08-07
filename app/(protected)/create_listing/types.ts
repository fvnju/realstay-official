import { PropertyType } from "./constants";

export interface ListingFormData {
  address: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  propertyType: PropertyType;
}

export interface FormSectionProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
}

export interface PropertyTypeDropdownProps {
  value: PropertyType;
  onChange: (value: PropertyType) => void;
}
