import { z } from "zod";
import { NIGERIAN_STATES, PAYMENT_CYCLES, PROPERTY_TYPES } from "./constants";

// Extract valid values from constants
const validStates = NIGERIAN_STATES.map((state) => state.value);
const validPropertyTypes = PROPERTY_TYPES.map((type) => type.value);
const validPaymentCycles = PAYMENT_CYCLES.map((cycle) => cycle.value);

// Step 1: Basic Information (index.tsx)
export const step1Schema = z.object({
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters")
    .trim(),
  state: z.enum(validStates as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid state" }),
  }),
  lga: z.string().optional(), // LGA is optional as specified
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  photos: z
    .array(
      z.object({
        id: z.string(),
        uri: z.string(),
        width: z.number(),
        height: z.number(),
        fileSize: z.number().optional(),
        fileName: z.string().optional(),
      })
    )
    .min(1, "At least 1 photo is required")
    .max(10, "Maximum 10 photos allowed"),
});

// Step 2: Property Type (part2.tsx)
export const step2Schema = z.object({
  propertyType: z.enum(validPropertyTypes as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid property type" }),
  }),
});

// Step 3: Amenities (part3.tsx)
export const step3Schema = z.object({
  amenities: z.array(z.string()).default([]), // Amenities can be empty
});

// Step 4: Property Details (part4.tsx)
export const step4Schema = z.object({
  bedrooms: z
    .number()
    .min(1, "At least 1 bedroom is required")
    .max(20, "Maximum 20 bedrooms allowed"),
  bathrooms: z
    .number()
    .min(1, "At least 1 bathroom is required")
    .max(20, "Maximum 20 bathrooms allowed"),
  beds: z
    .number()
    .min(1, "At least 1 bed is required")
    .max(50, "Maximum 50 beds allowed"),
  petsAllowed: z.boolean(),
  partiesAllowed: z.boolean(),
});

// Step 5: Title & Description (part5.tsx)
export const step5Schema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description must be less than 1000 characters")
    .trim(),
});

// Step 6: Pricing (part6.tsx)
export const step6Schema = z.object({
  price: z
    .number()
    .min(1000, "Price must be at least ₦1,000")
    .max(10000000, "Price must be less than ₦10,000,000"),
  paymentCycle: z.enum(validPaymentCycles as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid payment cycle" }),
  }),
});

// Complete form schema
export const completeListingSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema);

// Export types
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type Step6Data = z.infer<typeof step6Schema>;
export type CompleteListingData = z.infer<typeof completeListingSchema>;

// Validation helper functions
export const validateStep1 = (data: any) => {
  return step1Schema.safeParse(data);
};

export const validateStep2 = (data: any) => {
  return step2Schema.safeParse(data);
};

export const validateStep3 = (data: any) => {
  return step3Schema.safeParse(data);
};

export const validateStep4 = (data: any) => {
  return step4Schema.safeParse(data);
};

export const validateStep5 = (data: any) => {
  return step5Schema.safeParse(data);
};

export const validateStep6 = (data: any) => {
  return step6Schema.safeParse(data);
};

export const validateCompleteListing = (data: any) => {
  return completeListingSchema.safeParse(data);
};
