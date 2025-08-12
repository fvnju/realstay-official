import { useListingForm } from "./useListingForm";

/**
 * Debug hook to help test and troubleshoot validation
 * Use this in development to see validation states
 */
export const useValidationDebug = () => {
  const {
    step1Validation,
    step2Validation,
    step3Validation,
    step4Validation,
    step5Validation,
    step6Validation,
    formData,
  } = useListingForm();

  const logValidationState = (stepNumber?: number) => {
    const validations = {
      step1: step1Validation,
      step2: step2Validation,
      step3: step3Validation,
      step4: step4Validation,
      step5: step5Validation,
      step6: step6Validation,
    };

    if (stepNumber) {
      const stepKey = `step${stepNumber}` as keyof typeof validations;
      const validation = validations[stepKey];
      console.log(`=== Step ${stepNumber} Validation ===`);
      console.log("Is Valid:", validation.isValid);
      console.log("Errors:", validation.errors);
      console.log("Form Data:", formData);
    } else {
      console.log("=== All Validation States ===");
      Object.entries(validations).forEach(([step, validation]) => {
        console.log(`${step}:`, {
          isValid: validation.isValid,
          errors: validation.errors,
        });
      });
      console.log("Complete Form Data:", formData);
    }
  };

  const getValidationSummary = () => {
    return {
      step1: {
        valid: step1Validation.isValid,
        errorCount: Object.keys(step1Validation.errors).length,
      },
      step2: {
        valid: step2Validation.isValid,
        errorCount: Object.keys(step2Validation.errors).length,
      },
      step3: {
        valid: step3Validation.isValid,
        errorCount: Object.keys(step3Validation.errors).length,
      },
      step4: {
        valid: step4Validation.isValid,
        errorCount: Object.keys(step4Validation.errors).length,
      },
      step5: {
        valid: step5Validation.isValid,
        errorCount: Object.keys(step5Validation.errors).length,
      },
      step6: {
        valid: step6Validation.isValid,
        errorCount: Object.keys(step6Validation.errors).length,
      },
    };
  };

  return {
    logValidationState,
    getValidationSummary,
    validations: {
      step1: step1Validation,
      step2: step2Validation,
      step3: step3Validation,
      step4: step4Validation,
      step5: step5Validation,
      step6: step6Validation,
    },
    formData,
  };
};
