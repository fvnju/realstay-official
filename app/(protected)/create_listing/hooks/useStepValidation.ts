import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { toast } from "sonner-native";
import {
  listingAddressAtom,
  listingAmenities,
  listingBathroomsAtom,
  listingBedroomsAtom,
  listingBedsAtom,
  listingDescriptionAtom,
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
} from "../store";
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  validateStep6,
} from "../validation";
import { useListingForm } from "./useListingForm";

export const useStepValidation = () => {
  // Get current atom values directly for fresh validation
  const address = useAtomValue(listingAddressAtom);
  const state = useAtomValue(listingStateAtom);
  const lga = useAtomValue(listingLgaAtom);
  const latitude = useAtomValue(listingLatitudeAtom);
  const longitude = useAtomValue(listingLongitudeAtom);
  const photos = useAtomValue(listingPhotosAtom);
  const propertyType = useAtomValue(listingPropertyTypeAtom);
  const amenities = useAtomValue(listingAmenities);
  const bedrooms = useAtomValue(listingBedroomsAtom);
  const bathrooms = useAtomValue(listingBathroomsAtom);
  const beds = useAtomValue(listingBedsAtom);
  const petsAllowed = useAtomValue(listingPetsAllowedAtom);
  const partiesAllowed = useAtomValue(listingPartiesAllowedAtom);
  const title = useAtomValue(listingTitleAtom);
  const description = useAtomValue(listingDescriptionAtom);
  const price = useAtomValue(listingPriceAtom);
  const paymentCycle = useAtomValue(listingPaymentCycleAtom);

  // Also get the validation atoms for the validations object
  const {
    step1Validation,
    step2Validation,
    step3Validation,
    step4Validation,
    step5Validation,
    step6Validation,
  } = useListingForm();

  const validateAndShowErrors = useCallback(
    (stepNumber: number) => {
      let validation;
      let stepName;
      let currentData;

      switch (stepNumber) {
        case 1:
          stepName = "Basic Information";
          currentData = { address, state, lga, latitude, longitude, photos };
          validation = validateStep1(currentData);
          break;
        case 2:
          stepName = "Property Type";
          currentData = { propertyType };
          validation = validateStep2(currentData);
          break;
        case 3:
          stepName = "Amenities";
          currentData = { amenities };
          validation = validateStep3(currentData);
          break;
        case 4:
          stepName = "Property Details";
          currentData = {
            bedrooms,
            bathrooms,
            beds,
            petsAllowed,
            partiesAllowed,
          };
          validation = validateStep4(currentData);
          break;
        case 5:
          stepName = "Title & Description";
          currentData = { title, description };
          validation = validateStep5(currentData);
          break;
        case 6:
          stepName = "Pricing";
          currentData = { price, paymentCycle };
          validation = validateStep6(currentData);
          break;
        default:
          return true;
      }

      if (!validation.success) {
        // Get the first error message
        const firstError = validation.error.errors[0];

        if (firstError) {
          toast.error(firstError.message);
        }

        return false;
      }

      return true;
    },
    [
      address,
      state,
      lga,
      latitude,
      longitude,
      photos,
      propertyType,
      amenities,
      bedrooms,
      bathrooms,
      beds,
      petsAllowed,
      partiesAllowed,
      title,
      description,
      price,
      paymentCycle,
    ]
  );

  const canProceedToStep = useCallback(
    (currentStep: number) => {
      return validateAndShowErrors(currentStep);
    },
    [validateAndShowErrors]
  );

  return {
    validateAndShowErrors,
    canProceedToStep,
    validations: {
      step1: step1Validation,
      step2: step2Validation,
      step3: step3Validation,
      step4: step4Validation,
      step5: step5Validation,
      step6: step6Validation,
    },
  };
};
