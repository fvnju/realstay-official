import { Drawer } from "expo-router/drawer";
import {
  List,
  MagnifyingGlass,
  SlidersHorizontal,
} from "phosphor-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";

export default function ChatsLayout() {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: theme.colors.appBackground }}
    >
      <Drawer
        screenOptions={({ navigation }) => ({
          header: (props) => (
            <View
              style={{
                paddingTop: top + 8,
                paddingHorizontal: 16,
                flexDirection: "row",
                backgroundColor: theme.colors.appBackground,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={navigation.toggleDrawer}
              >
                <View style={{ padding: (48 - 24) / 2 }}>
                  <List
                    size={24}
                    weight="bold"
                    color={theme.colors.appTextPrimary}
                  />
                </View>
                <Text
                  style={{
                    color: theme.colors.appTextPrimary,
                    ...theme.fontStyles.semiBold,
                    fontSize: theme.fontSizes.h3,
                    //lineHeight: theme.fontSizes.xl_3,
                    letterSpacing:
                      theme.letterSpacing.bitTight * theme.fontSizes.h3,
                    marginLeft: 8,
                  }}
                >
                  {capitalize(props.route.name)}
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                style={{ padding: (48 - 28) / 2, marginRight: 12 }}
              >
                <MagnifyingGlass
                  size={28}
                  weight="bold"
                  color={theme.colors.appTextPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: (48 - 28) / 2 }}>
                <SlidersHorizontal
                  size={28}
                  weight="bold"
                  color={theme.colors.appTextPrimary}
                />
              </TouchableOpacity>
            </View>
          ),
          drawerStyle: {
            backgroundColor: theme.colors.appBackground,
          },
        })}
      >
        <Drawer.Screen
          name="all chats"
          options={{
            drawerLabel: "All Chats",
            title: "",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

function capitalize(s: string) {
  return s
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
