export const PROPERTY_TYPES = [
  { value: "House", label: "House" },
  { value: "Land", label: "Land" },
  { value: "Apartment", label: "Apartment" },
  { value: "Condo", label: "Condo" },
  { value: "Villa", label: "Villa" },
] as const;

export type PropertyType = typeof PROPERTY_TYPES[number]["value"];

export const DEFAULT_PROPERTY_TYPE: PropertyType = "House";

export const DEFAULT_LOCATION = {
  latitude: 9.0573,
  longitude: 7.4951,
  label: "Somewhere",
} as const;

export const FORM_LABELS = {
  address: "Address",
  addressHint: "This is just an approximate address that will be shown to guest users that hasn't indicated interest.",
  location: "Get location data",
  photos: "Upload photos",
  propertyType: "Type of property",
} as const;
