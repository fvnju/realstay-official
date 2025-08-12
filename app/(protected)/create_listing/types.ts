import { NigerianState, PaymentCycle, PropertyType } from "./constants";

export interface ImageData {
  id: string;
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
  fileName?: string;
}

export interface ListingFormData {
  address: string;
  state: NigerianState;
  lga: string;
  latitude?: number;
  longitude?: number;
  photos: ImageData[];
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  petsAllowed: boolean;
  partiesAllowed: boolean;
  title: string;
  description: string;
  price: number;
  paymentCycle: PaymentCycle;
  amenities: string[];
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
