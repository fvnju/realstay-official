import TabBarIcon from "@/components/TabBarIcon";
import { useTheme } from "@/hooks/useTheme";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, Tabs } from "expo-router";
import React from "react";
import {
  BackHandler,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Layout() {
  // const [nothing, setNothing] = useState(0);
  // useEffect(() => {
  // 	setNothing((prev) => prev + 1);
  // }, []);
  const styles = styleSheet();
  const screens = ["dashboard", "listings", "chats", "profile"] as const;

  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  // Add platform-specific tab bar height
  const tabBarHeight = 80 + bottom; // Platform.OS === "android" ? 80 : 100;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Return true to prevent default back action
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  return (
    <SafeAreaProvider>
      <Stack.Screen
        options={{
          fullScreenGestureEnabled: false,
          animation: "fade",
          gestureEnabled: false,
          contentStyle: {
            backgroundColor: theme.colors.appBackground,
          },
          headerShown: false,
        }}
      />

      <Tabs
        backBehavior="none"
        screenOptions={{
          headerShown: false,
          tabBarStyle: [
            styles.bottomTab,
            {
              height: tabBarHeight,
              elevation: 0,
              paddingTop: 20,
              paddingBottom: 0, // Platform.OS === "android" ? bottom : 0,
              paddingHorizontal: 12,
            },
          ],
          tabBarActiveTintColor: styles.activeIcon.color,
          tabBarInactiveTintColor: styles.tabIcon.color,
          sceneStyle: {
            backgroundColor: styles.bottomTab.backgroundColor,
            height: Dimensions.get("screen").height,
          },
          headerStatusBarHeight: 0,
          freezeOnBlur: true,
          animation: "shift",
          tabBarButton: (props) => {
            // Omit the ref from props to avoid the type issue
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { ref, ...otherProps } = props;
            return (
              <TouchableWithoutFeedback onPress={otherProps.onPress}>
                <View
                  style={{
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {otherProps.children}
                </View>
              </TouchableWithoutFeedback>
            );
          },
        }}
      >
        {screens.map((value) => (
          <Tabs.Screen
            key={`guest-${value}`}
            name={value === "dashboard" ? "index" : value}
            options={{
              title: toTitleCase(value),
              tabBarIcon(props) {
                return TabBarIcon({ name: value, ...props });
              },
              animation: "none",
            }}
          />
        ))}
      </Tabs>
    </SafeAreaProvider>
  );
}

const styleSheet = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();

  return {
    activeIcon: {
      color: theme.colors.elementsButtonBackground,
    },
    tabIcon: {
      color: `${theme.colors.elementsTabBarIconNormal}80`, //66
    },
    bottomTab: {
      borderTopColor: theme.colors.elementsTextFieldBorder,
      borderTopWidth: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.appBackground,
    },
  };
};

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}
