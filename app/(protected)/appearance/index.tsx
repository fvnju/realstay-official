import { appearanceAtom, useTheme } from "@/hooks/useTheme";
import { Stack, useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { CaretLeft } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const THEME_OPTIONS = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "auto", label: "System" },
];

// Custom hook for local theme preview
function useLocalTheme(localAppearance: "auto" | "light" | "dark") {
  const systemTheme = useTheme(); // fallback for fontStyles, etc.
  // Import the actual theme objects
  const { lightTheme, darkTheme } = require("@/constants/themes");
  const colorScheme =
    localAppearance === "auto"
      ? systemTheme.color.appBackground === "#1A1A1A"
        ? "dark"
        : "light"
      : localAppearance;
  const theme = useMemo(() => {
    if (colorScheme === "dark") return darkTheme;
    return lightTheme;
  }, [colorScheme, lightTheme, darkTheme]);
  // Merge fontStyles etc from systemTheme for consistency
  return { ...theme, fontStyles: systemTheme.fontStyles };
}

export default function AppearanceScreen() {
  const router = useRouter();
  const globalAppearance = useAtomValue(appearanceAtom);
  const setAppearance = useSetAtom(appearanceAtom);
  const [localAppearance, setLocalAppearance] = useState(globalAppearance);
  const localTheme = useLocalTheme(localAppearance);
  const window = Dimensions.get("window");
  const { top } = useSafeAreaInsets();

  const handleApply = () => {
    setAppearance(localAppearance);
  };

  const handleRevert = () => {
    setLocalAppearance(globalAppearance);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: localTheme.color.appBackground, paddingTop: top },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <CaretLeft color={localTheme.color.appTextPrimary} weight="bold" />
        </TouchableOpacity>
        <Text
          style={[
            styles.header,
            { color: localTheme.color.appTextPrimary },
            localTheme.fontStyles.semiBold,
          ]}
        >
          Theme preview
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Dummy UI Preview */}
        <View
          style={[
            styles.dummyPreview,
            {
              backgroundColor: localTheme.color.appSurface,
              shadowColor: localTheme.color.appDropShadow,
            },
          ]}
        >
          <View style={styles.dummyFlag} />
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginVertical: 8,
              color: localTheme.color.appTextPrimary,
            }}
          >
            RealStay
          </Text>
          <View style={styles.dummyAvatar} />
          <View style={styles.dummyRow}>
            {[1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={[
                  styles.dummyDot,
                  { backgroundColor: localTheme.color.elementsTextFieldBorder },
                ]}
              />
            ))}
          </View>
          <View
            style={[
              styles.dummyBox,
              { backgroundColor: localTheme.color.elementsTextFieldBackground },
            ]}
          />
        </View>
        {/* Theme Option Buttons */}
        <View style={styles.themeOptionsRow}>
          {THEME_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              onPress={() =>
                setLocalAppearance(option.key as "auto" | "light" | "dark")
              }
              style={[
                styles.themeOption,
                localAppearance === option.key && styles.themeOptionSelected,
                {
                  borderColor:
                    localAppearance === option.key
                      ? localTheme.color.appPrimary
                      : "#e5e5ea",
                  backgroundColor: localTheme.color.appSurface,
                },
              ]}
            >
              <Text style={{ color: localTheme.color.appTextPrimary }}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      {/* Bottom Buttons */}
      <View style={{ width: "100%", paddingBottom: 32 }}>
        <TouchableOpacity
          onPress={handleApply}
          style={[
            styles.applyButton,
            {
              backgroundColor: localTheme.color.appPrimary,
              opacity: localAppearance === globalAppearance ? 0.5 : 1,
            },
          ]}
          disabled={localAppearance === globalAppearance}
        >
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}
          >
            Apply
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRevert}
          style={[
            styles.revertButton,
            { borderColor: localTheme.color.appPrimary },
          ]}
        >
          <Text
            style={{
              color: localTheme.color.appPrimary,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Revert
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
  },
  dummyPreview: {
    width: 220,
    borderRadius: 24,
    borderWidth: 2,
    padding: 16,
    alignItems: "center",
    marginBottom: 32,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dummyFlag: {
    width: 32,
    height: 20,
    backgroundColor: "#eee",
    borderRadius: 4,
    alignSelf: "center",
    marginVertical: 8,
  },
  dummyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginVertical: 8,
  },
  dummyRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  dummyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  dummyBox: {
    width: "90%",
    height: 40,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "center",
  },
  themeOptionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 16,
  },
  themeOption: {
    padding: 12,
    borderRadius: 24,
    borderWidth: 2,
    minWidth: 70,
    alignItems: "center",
    marginHorizontal: 4,
  },
  themeOptionSelected: {
    borderColor: "#0078ff",
  },
  bottomButtonContainer: {
    width: "100%",
    position: "absolute",
    bottom: 24,
    left: 0,
    paddingHorizontal: 16,
  },
  applyButton: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    marginBottom: 12,
  },
  revertButton: {
    borderWidth: 1.5,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "transparent",
    width: "100%",
  },
});
