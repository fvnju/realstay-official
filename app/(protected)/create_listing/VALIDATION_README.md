# Listing Form Validation System

This document explains the comprehensive validation system implemented for the multi-step listing creation form.

## Overview

The validation system uses **Zod** for schema validation and **sonner-native** for toast error messages. Validation occurs when users attempt to navigate to the next step, preventing progression if the current step has validation errors.

## Architecture

### Files Structure

```
app/(protected)/create_listing/
├── validation.ts           # Zod schemas for each step
├── hooks/
│   ├── useListingForm.ts   # Form state management
│   └── useStepValidation.ts # Validation logic & toast handling
├── store.ts                # Jotai atoms with validation
└── _layout.tsx             # Navigation with validation checks
```

### Validation Flow

1. User clicks "Continue" or "Get Started"
2. `_layout.tsx` calls `canProceedToStep(currentStep)`
3. `useStepValidation` validates current step data using Zod schemas
4. If invalid: Shows toast error and prevents navigation
5. If valid: Allows navigation to next step

## Step-by-Step Validation Rules

### Step 1: Basic Information (`index.tsx`)

- **Address**: 10-200 characters, required
- **State**: Must be valid Nigerian state, required
- **LGA**: Optional (as specified)
- **Photos**: 1-10 images required
- **Coordinates**: Optional

### Step 2: Property Type (`part2.tsx`)

- **Property Type**: Must be one of: House, Land, Apartment, Condo, Villa

### Step 3: Amenities (`part3.tsx`)

- **Amenities**: Array of strings, can be empty (no validation errors)

### Step 4: Property Details (`part4.tsx`)

- **Bedrooms**: 1-20, required
- **Bathrooms**: 1-20, required
- **Beds**: 1-50, required
- **Pets Allowed**: Boolean, required
- **Parties Allowed**: Boolean, required

### Step 5: Title & Description (`part5.tsx`)

- **Title**: 10-100 characters, required
- **Description**: 50-1000 characters, required

### Step 6: Pricing (`part6.tsx`)

- **Price**: ₦1,000 - ₦10,000,000, required
- **Payment Cycle**: Must be one of: daily, weekly, monthly, yearly

## Usage Examples

### In Navigation (\_layout.tsx)

```typescript
import { useStepValidation } from "./hooks/useStepValidation";

function Layout() {
  const { canProceedToStep } = useStepValidation();

  const nextActions = useMemo(
    () =>
      new Map([
        [
          1,
          () => {
            if (!canProceedToStep(1)) return; // Validates & shows toast if invalid
            // Navigate to next step...
          },
        ],
        // ... other steps
      ]),
    [canProceedToStep]
  );
}
```

### In Components (Optional)

```typescript
import { useStepValidation } from "../hooks/useStepValidation";

function MyStepComponent() {
  const { validations } = useStepValidation();

  // Access validation state for current step
  const isValid = validations.step1.isValid;
  const errors = validations.step1.errors;

  return (
    <View>
      {errors.address && <Text style={styles.error}>{errors.address}</Text>}
      {/* ... rest of component */}
    </View>
  );
}
```

## Error Handling

### Toast Messages

- Errors are displayed using `sonner-native` toast
- Only the first validation error is shown per attempt
- Toast appears immediately when validation fails

### Error Types

- **Required Field**: "Field is required"
- **Length Validation**: "Must be at least X characters"
- **Range Validation**: "Must be between X and Y"
- **Enum Validation**: "Please select a valid option"

## Customization

### Adding New Validation Rules

1. Update the relevant schema in `validation.ts`
2. The validation atoms in `store.ts` will automatically use the new rules
3. Error messages will appear in toasts automatically

### Changing Error Messages

Update the error messages in the Zod schemas:

```typescript
z.string().min(10, "Your custom error message here");
```

### Adding New Steps

1. Create new schema in `validation.ts`
2. Add validation atom in `store.ts`
3. Export validation in `useListingForm.ts`
4. Add step validation in `useStepValidation.ts`
5. Update navigation in `_layout.tsx`

## Benefits

1. **Consistent Validation**: All steps use the same validation pattern
2. **Type Safety**: Zod provides runtime type checking
3. **User Feedback**: Immediate toast feedback prevents confusion
4. **Navigation Control**: Prevents incomplete data from progressing
5. **Maintainable**: Centralized validation logic
6. **Extensible**: Easy to add new rules or steps

## Dependencies

- `zod`: Schema validation
- `sonner-native`: Toast notifications
- `jotai`: State management
- `react-native-reanimated`: Animations (existing)

## Installation

If Zod is not installed:

```bash
npm install zod
```

The validation system is now fully integrated and ready to use!
