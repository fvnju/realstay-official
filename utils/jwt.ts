import * as SecureStore from "expo-secure-store";
import { atom } from "jotai";

export const jwtAtom = atom<string | null>(SecureStore.getItem("access_token"));

export async function saveJWT(
  token: string,
  setJWT: (token: string | null) => void,
) {
  await SecureStore.setItemAsync("access_token", token);
  setJWT(token);
}

export async function loadJWT(setJWT: (token: string | null) => void) {
  const token = await SecureStore.getItemAsync("access_token");
  setJWT(token);
}

export async function logout(setJWT: (token: string | null) => void) {
  await SecureStore.deleteItemAsync("access_token");
  setJWT(null);
}
