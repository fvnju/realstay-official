export type ListingType = {
  place_holder_address: string
  google_formatted_address: string
  state: string
  lga: string
  lat: number
  lng: number
  type: string
  no_of_beds: number
  are_pets_allowed: boolean
  no_of_bedrooms: number
  no_of_bathrooms: number
  are_parties_allowed: boolean
  extra_offerings: string[]
  title: string
  description: string
  cost: number
  cost_cycle: string
  photos: string[]
}