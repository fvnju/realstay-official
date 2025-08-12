export const PROPERTY_TYPES = [
  { value: "House", label: "House" },
  { value: "Land", label: "Land" },
  { value: "Apartment", label: "Apartment" },
  { value: "Condo", label: "Condo" },
  { value: "Villa", label: "Villa" },
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number]["value"];

export const DEFAULT_PROPERTY_TYPE: PropertyType = "House";

export const DEFAULT_LOCATION = {
  latitude: 9.0573,
  longitude: 7.4951,
  label: "Somewhere",
} as const;

export const PAYMENT_CYCLES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;

export type PaymentCycle = (typeof PAYMENT_CYCLES)[number]["value"];

export const DEFAULT_PAYMENT_CYCLE: PaymentCycle = "daily";

// Nigerian States
export const NIGERIAN_STATES = [
  { value: "abia", label: "Abia" },
  { value: "adamawa", label: "Adamawa" },
  { value: "akwa-ibom", label: "Akwa Ibom" },
  { value: "anambra", label: "Anambra" },
  { value: "bauchi", label: "Bauchi" },
  { value: "bayelsa", label: "Bayelsa" },
  { value: "benue", label: "Benue" },
  { value: "borno", label: "Borno" },
  { value: "cross-river", label: "Cross River" },
  { value: "delta", label: "Delta" },
  { value: "ebonyi", label: "Ebonyi" },
  { value: "edo", label: "Edo" },
  { value: "ekiti", label: "Ekiti" },
  { value: "enugu", label: "Enugu" },
  { value: "gombe", label: "Gombe" },
  { value: "imo", label: "Imo" },
  { value: "jigawa", label: "Jigawa" },
  { value: "kaduna", label: "Kaduna" },
  { value: "kano", label: "Kano" },
  { value: "katsina", label: "Katsina" },
  { value: "kebbi", label: "Kebbi" },
  { value: "kogi", label: "Kogi" },
  { value: "kwara", label: "Kwara" },
  { value: "lagos", label: "Lagos" },
  { value: "nasarawa", label: "Nasarawa" },
  { value: "niger", label: "Niger" },
  { value: "ogun", label: "Ogun" },
  { value: "ondo", label: "Ondo" },
  { value: "osun", label: "Osun" },
  { value: "oyo", label: "Oyo" },
  { value: "plateau", label: "Plateau" },
  { value: "rivers", label: "Rivers" },
  { value: "sokoto", label: "Sokoto" },
  { value: "taraba", label: "Taraba" },
  { value: "yobe", label: "Yobe" },
  { value: "zamfara", label: "Zamfara" },
  { value: "fct", label: "Federal Capital Territory" },
] as const;

export type NigerianState = (typeof NIGERIAN_STATES)[number]["value"];

// Sample LGAs for major states (you can expand this)
export const LAGOS_LGAS = [
  { value: "alimosho", label: "Alimosho" },
  { value: "amuwo-odofin", label: "Amuwo-Odofin" },
  { value: "apapa", label: "Apapa" },
  { value: "badagry", label: "Badagry" },
  { value: "epe", label: "Epe" },
  { value: "eti-osa", label: "Eti-Osa" },
  { value: "ibeju-lekki", label: "Ibeju-Lekki" },
  { value: "ifako-ijaiye", label: "Ifako-Ijaiye" },
  { value: "ikeja", label: "Ikeja" },
  { value: "ikorodu", label: "Ikorodu" },
  { value: "kosofe", label: "Kosofe" },
  { value: "lagos-island", label: "Lagos Island" },
  { value: "lagos-mainland", label: "Lagos Mainland" },
  { value: "mushin", label: "Mushin" },
  { value: "ojo", label: "Ojo" },
  { value: "oshodi-isolo", label: "Oshodi-Isolo" },
  { value: "shomolu", label: "Shomolu" },
  { value: "surulere", label: "Surulere" },
] as const;

export const FCT_LGAS = [
  { value: "abaji", label: "Abaji" },
  { value: "bwari", label: "Bwari" },
  { value: "gwagwalada", label: "Gwagwalada" },
  { value: "kuje", label: "Kuje" },
  { value: "kwali", label: "Kwali" },
  { value: "municipal", label: "Municipal Area Council" },
] as const;

// You can add more states' LGAs as needed
export const STATE_LGAS: Record<
  NigerianState,
  readonly { value: string; label: string }[]
> = {
  lagos: LAGOS_LGAS,
  fct: FCT_LGAS,
  // Add other states as needed, for now defaulting to empty array
  abia: [],
  adamawa: [],
  "akwa-ibom": [],
  anambra: [],
  bauchi: [],
  bayelsa: [],
  benue: [],
  borno: [],
  "cross-river": [],
  delta: [],
  ebonyi: [],
  edo: [],
  ekiti: [],
  enugu: [],
  gombe: [],
  imo: [],
  jigawa: [],
  kaduna: [],
  kano: [],
  katsina: [],
  kebbi: [],
  kogi: [],
  kwara: [],
  nasarawa: [],
  niger: [],
  ogun: [],
  ondo: [],
  osun: [],
  oyo: [],
  plateau: [],
  rivers: [],
  sokoto: [],
  taraba: [],
  yobe: [],
  zamfara: [],
};

export const FORM_LABELS = {
  address: "Address",
  addressHint:
    "This is just an approximate address that will be shown to guest users that hasn't indicated interest.",
  state: "State",
  stateHint: "Select the state where your property is located",
  lga: "Local Government Area",
  lgaHint: "Select the LGA within the chosen state",
  location: "Get location data",
  photos: "Upload photos",
  propertyType: "Type of property",
  bedrooms: "Number of bedrooms",
  bathrooms: "Number of bathrooms",
  beds: "Number of beds",
  petsAllowed: "Pets allowed",
  partiesAllowed: "Parties allowed",
  title: "Property title",
  titleHint:
    "Create a catchy title that highlights your property's best features",
  description: "Property description",
  descriptionHint:
    "Describe your property in detail to help guests understand what makes it special",
  price: "Price (₦)",
  priceHint: "Set a competitive price for your property",
  paymentCycle: "Payment cycle",
  paymentCycleHint: "How often guests will pay for your property",
} as const;
