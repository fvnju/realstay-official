import * as Location from "expo-location";
import { atom } from "jotai";

export async function getCurrentLocation() {
  // Ask for permission
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return null;
  }

  // Get position
  let { coords } = await Location.getCurrentPositionAsync({});
  return coords; // { latitude, longitude, altitude, ... }
}

export const locationAtom = atom<Location.LocationObjectCoords | null>(null);
// Async atom that fetches location when accessed
// export const locationAsyncAtom = atom(async () => {
//   return await getCurrentLocation();
// });

// export { locationAtom };
