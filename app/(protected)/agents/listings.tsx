import { useTheme } from "@/hooks/useTheme";
import { Plus } from "phosphor-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function ListingsPage() {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View style={{ paddingTop: top + 12, paddingHorizontal: 16, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={[
            { color: theme.colors.appTextPrimary, fontSize: 26 },
            theme.fontStyles.bold,
          ]}
        >
          Your listings
        </Text>
        <TouchableOpacity
          style={{
            height: 44,
            width: 44,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          onPress={() => {
            // router.push("/create_listing");
            toast.error("This feature is not yet available");
          }}
        >
          <Plus size={24} weight="bold" color={theme.colors.appTextPrimary} />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <Text
          style={[
            {
              fontSize: 48,
              color: theme.colors.appTextPrimary,
              textAlign: "center",
            },
            theme.fontStyles.bold,
          ]}
        >
          You&apos;ve made no listings yet
        </Text>
      </View>
    </View>
  );
}
