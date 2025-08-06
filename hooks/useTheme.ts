import { atom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import { lightTheme, darkTheme } from "@/constants/themes";

export const appearanceAtom = atom<"auto" | "dark" | "light">("auto");

export const useTheme = () => {
  const appearance = useAtomValue(appearanceAtom);
  const systemColorScheme = useColorScheme();

  const colorScheme = appearance === "auto" ? systemColorScheme : appearance;

  const [theme, setTheme] = useState(
    colorScheme === "dark" ? darkTheme : lightTheme,
  );

  useEffect(() => {
    setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
  }, [colorScheme]);

  return theme;
};

export type useThemeType = ReturnType<typeof useTheme>;
