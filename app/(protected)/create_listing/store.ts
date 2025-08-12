import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { DEFAULT_PROPERTY_TYPE } from "./constants";
import { ImageData, ListingFormData } from "./types";

// Individual field atoms - these will persist across navigation
export const listingAddressAtom = atom<string>("");
export const listingStateAtom = atom<string>("");
export const listingLgaAtom = atom<string>("");
export const listingLatitudeAtom = atom<number | undefined>(undefined);
export const listingLongitudeAtom = atom<number | undefined>(undefined);
export const listingPhotosAtom = atom<ImageData[]>([]);
export const listingPropertyTypeAtom = atom<string>(DEFAULT_PROPERTY_TYPE);
export const listingBedroomsAtom = atom<number>(1);
export const listingBathroomsAtom = atom<number>(1);
export const listingBedsAtom = atom<number>(1);
export const listingPetsAllowedAtom = atom<boolean>(false);
export const listingPartiesAllowedAtom = atom<boolean>(false);
export const listingTitleAtom = atom<string>("");
export const listingDescriptionAtom = atom<string>("");
export const listingPriceAtom = atom<number>(0);
export const listingPaymentCycleAtom = atom<string>("daily");
export const listingAmenities = atom<string[]>([]);

// Computed atom that combines all form data
export const listingFormDataAtom = atom(
  (get): ListingFormData => ({
    address: get(listingAddressAtom),
    state: get(listingStateAtom) as any, // Type assertion for NigerianState
    lga: get(listingLgaAtom),
    latitude: get(listingLatitudeAtom),
    longitude: get(listingLongitudeAtom),
    photos: get(listingPhotosAtom),
    propertyType: get(listingPropertyTypeAtom) as any, // Type assertion for PropertyType
    bedrooms: get(listingBedroomsAtom),
    bathrooms: get(listingBathroomsAtom),
    beds: get(listingBedsAtom),
    petsAllowed: get(listingPetsAllowedAtom),
    partiesAllowed: get(listingPartiesAllowedAtom),
    title: get(listingTitleAtom),
    description: get(listingDescriptionAtom),
    price: get(listingPriceAtom),
    paymentCycle: get(listingPaymentCycleAtom) as any, // Type assertion for PaymentCycle
    amenities: get(listingAmenities),
  })
);

// Reset atom to clear all form data (useful after successful submission)
export const resetListingFormAtom = atomWithReset(null);

// Action to reset all form fields
export const resetAllListingFieldsAtom = atom(null, (get, set) => {
  set(listingAddressAtom, "");
  set(listingStateAtom, "");
  set(listingLgaAtom, "");
  set(listingLatitudeAtom, undefined);
  set(listingLongitudeAtom, undefined);
  set(listingPhotosAtom, []);
  set(listingPropertyTypeAtom, DEFAULT_PROPERTY_TYPE);
  set(listingBedroomsAtom, 1);
  set(listingBathroomsAtom, 1);
  set(listingBedsAtom, 1);
  set(listingPetsAllowedAtom, false);
  set(listingPartiesAllowedAtom, false);
  set(listingTitleAtom, "");
  set(listingDescriptionAtom, "");
  set(listingPriceAtom, 0);
  set(listingPaymentCycleAtom, "daily");
  set(listingAmenities, []);
});

// Validation atoms for each step using Zod
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  validateStep6,
} from "./validation";

export const step1ValidationAtom = atom((get) => {
  const data = {
    address: get(listingAddressAtom),
    state: get(listingStateAtom),
    lga: get(listingLgaAtom),
    latitude: get(listingLatitudeAtom),
    longitude: get(listingLongitudeAtom),
    photos: get(listingPhotosAtom),
  };

  const result = validateStep1(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const field = error.path[0] as string;
    errors[field] = error.message;
  });

  return { isValid: false, errors };
});

export const step2ValidationAtom = atom((get) => {
  const data = {
    propertyType: get(listingPropertyTypeAtom),
  };

  const result = validateStep2(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const field = error.path[0] as string;
    errors[field] = error.message;
  });

  return { isValid: false, errors };
});

export const step3ValidationAtom = atom((get) => {
  const data = {
    amenities: get(listingAmenities),
  };

  const result = validateStep3(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const field = error.path[0] as string;
    errors[field] = error.message;
  });

  return { isValid: false, errors };
});

export const step4ValidationAtom = atom((get) => {
  const data = {
    bedrooms: get(listingBedroomsAtom),
    bathrooms: get(listingBathroomsAtom),
    beds: get(listingBedsAtom),
    petsAllowed: get(listingPetsAllowedAtom),
    partiesAllowed: get(listingPartiesAllowedAtom),
  };

  const result = validateStep4(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const field = error.path[0] as string;
    errors[field] = error.message;
  });

  return { isValid: false, errors };
});

export const step5ValidationAtom = atom((get) => {
  const data = {
    title: get(listingTitleAtom),
    description: get(listingDescriptionAtom),
  };

  const result = validateStep5(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const field = error.path[0] as string;
    errors[field] = error.message;
  });

  return { isValid: false, errors };
});

export const step6ValidationAtom = atom((get) => {
  const data = {
    price: get(listingPriceAtom),
    paymentCycle: get(listingPaymentCycleAtom),
  };

  const result = validateStep6(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const field = error.path[0] as string;
    errors[field] = error.message;
  });

  return { isValid: false, errors };
});
