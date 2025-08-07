import { Linking, Platform } from "react-native";

export const openMapsWithLocation = (latitude: number, longitude: number, label: string) => {
  const url = Platform.select({
    ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`,
    android: `geo:${latitude},${longitude}?q=${label}`,
  });
  
  if (url) {
    Linking.openURL(url);
  }
};

export const dismissKeyboard = () => {
  // This is imported from react-native's Keyboard module
  // We'll use it in the main component
};
