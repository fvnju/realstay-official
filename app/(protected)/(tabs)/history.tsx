import { WarningCircle } from "phosphor-react-native";
import { Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSheetRef } from "@/components/sheet";
import { useTheme } from "@/hooks/useTheme";

export default function History() {
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const sheetRef = useSheetRef();

  return (
    <View
      style={{
        paddingTop: top,
        paddingBottom: bottom,
        paddingHorizontal: 24,
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <Text
        style={{
          ...theme.fontStyles.semiBold,
          fontSize: theme.fontSizes.display,
          color: theme.color.appTextPrimary,
          letterSpacing: theme.letterSpacing.tight * theme.fontSizes.display,
        }}
      >
        History
      </Text>

      <View style={{ alignItems: "center" }}>
        <WarningCircle size={64} weight="fill" color={"#DF7811"} />
        <Text
          style={{
            ...theme.fontStyles.semiBold,
            fontSize: theme.fontSizes.lg,
            color: theme.color.appTextPrimary,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          No history yet
        </Text>
        <Text
          style={{
            ...theme.fontStyles.regular,
            fontSize: theme.fontSizes.sm,
            color: theme.color.appTextSecondary,
            textAlign: "center",
            width: width * 0.7,
            marginTop: 4,
          }}
        >
          When you book a stay or buy property, you'll see the details here.
        </Text>
      </View>

      <View />
    </View>
  );
}
