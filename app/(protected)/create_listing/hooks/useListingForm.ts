import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { NigerianState, PaymentCycle, PropertyType } from "../constants";
import {
  listingAddressAtom,
  listingAmenities,
  listingBathroomsAtom,
  listingBedroomsAtom,
  listingBedsAtom,
  listingDescriptionAtom,
  listingFormDataAtom,
  listingLatitudeAtom,
  listingLgaAtom,
  listingLongitudeAtom,
  listingPartiesAllowedAtom,
  listingPaymentCycleAtom,
  listingPetsAllowedAtom,
  listingPhotosAtom,
  listingPriceAtom,
  listingPropertyTypeAtom,
  listingStateAtom,
  listingTitleAtom,
  resetAllListingFieldsAtom,
  step1ValidationAtom,
  step2ValidationAtom,
  step3ValidationAtom,
  step4ValidationAtom,
  step5ValidationAtom,
  step6ValidationAtom,
} from "../store";
import { ImageData } from "../types";

export const useListingForm = () => {
  // Individual field hooks
  const [address, setAddress] = useAtom(listingAddressAtom);
  const [state, setState] = useAtom(listingStateAtom);
  const [lga, setLga] = useAtom(listingLgaAtom);
  const [latitude, setLatitude] = useAtom(listingLatitudeAtom);
  const [longitude, setLongitude] = useAtom(listingLongitudeAtom);
  const [photos, setPhotos] = useAtom(listingPhotosAtom);
  const [propertyType, setPropertyType] = useAtom(listingPropertyTypeAtom);
  const [bedrooms, setBedrooms] = useAtom(listingBedroomsAtom);
  const [bathrooms, setBathrooms] = useAtom(listingBathroomsAtom);
  const [beds, setBeds] = useAtom(listingBedsAtom);
  const [petsAllowed, setPetsAllowed] = useAtom(listingPetsAllowedAtom);
  const [partiesAllowed, setPartiesAllowed] = useAtom(
    listingPartiesAllowedAtom
  );
  const [title, setTitle] = useAtom(listingTitleAtom);
  const [description, setDescription] = useAtom(listingDescriptionAtom);
  const [price, setPrice] = useAtom(listingPriceAtom);
  const [paymentCycle, setPaymentCycle] = useAtom(listingPaymentCycleAtom);
  const [amenities, setAmenities] = useAtom(listingAmenities);

  // Complete form data
  const formData = useAtomValue(listingFormDataAtom);

  // Reset function
  const resetForm = useSetAtom(resetAllListingFieldsAtom);

  // Validation
  const step1Validation = useAtomValue(step1ValidationAtom);
  const step2Validation = useAtomValue(step2ValidationAtom);
  const step3Validation = useAtomValue(step3ValidationAtom);
  const step4Validation = useAtomValue(step4ValidationAtom);
  const step5Validation = useAtomValue(step5ValidationAtom);
  const step6Validation = useAtomValue(step6ValidationAtom);

  // Typed setters for better DX
  const updateState = useCallback(
    (newState: NigerianState) => {
      setState(newState);
      // Reset LGA when state changes
      setLga("");
    },
    [setState, setLga]
  );

  const updatePropertyType = useCallback(
    (newType: PropertyType) => {
      setPropertyType(newType);
    },
    [setPropertyType]
  );

  const updatePaymentCycle = useCallback(
    (newCycle: PaymentCycle) => {
      setPaymentCycle(newCycle);
    },
    [setPaymentCycle]
  );

  const updatePhotos = useCallback(
    (newPhotos: ImageData[]) => {
      setPhotos(newPhotos);
    },
    [setPhotos]
  );

  // Text field handlers for uncontrolled inputs
  const handleAddressChange = useCallback(
    (text: string) => {
      setAddress(text);
    },
    [setAddress]
  );

  const handleTitleChange = useCallback(
    (text: string) => {
      setTitle(text);
    },
    [setTitle]
  );

  const handleDescriptionChange = useCallback(
    (text: string) => {
      setDescription(text);
    },
    [setDescription]
  );

  const handlePriceChange = useCallback(
    (text: string) => {
      const numericValue = parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
      setPrice(numericValue);
    },
    [setPrice]
  );

  return {
    // Field values
    address,
    state: state as NigerianState,
    lga,
    latitude,
    longitude,
    photos,
    propertyType: propertyType as PropertyType,
    bedrooms,
    bathrooms,
    beds,
    petsAllowed,
    partiesAllowed,
    title,
    description,
    price,
    paymentCycle: paymentCycle as PaymentCycle,
    amenities,

    // Complete form data
    formData,

    // Setters
    setAddress,
    setState: updateState,
    setLga,
    setLatitude,
    setLongitude,
    setPhotos: updatePhotos,
    setPropertyType: updatePropertyType,
    setBedrooms,
    setBathrooms,
    setBeds,
    setPetsAllowed,
    setPartiesAllowed,
    setTitle,
    setDescription,
    setPrice,
    setPaymentCycle: updatePaymentCycle,
    setAmenities,

    // Text field handlers (for uncontrolled inputs)
    handleAddressChange,
    handleTitleChange,
    handleDescriptionChange,
    handlePriceChange,

    // Validation
    step1Validation,
    step2Validation,
    step3Validation,
    step4Validation,
    step5Validation,
    step6Validation,

    // Actions
    resetForm,
  };
};
