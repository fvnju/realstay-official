import { useTheme } from "@/hooks/useTheme";
import {
  Binoculars,
  BookmarksSimple,
  ChatCentered,
  GlobeHemisphereEast,
  House,
  ListDashes,
  UserCircle,
} from "phosphor-react-native";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";

export default function TabBarIcon(props: {
  focused: boolean;
  color: string;
  size: number;
  name?:
    | "explore"
    | "saved"
    | "history"
    | "chats"
    | "profile"
    | "dashboard"
    | "listings";
}) {
  const theme = useTheme();
  const styles = {
    activeTab: {
      borderColor: theme.color.appImageShade,
      borderWidth: StyleSheet.hairlineWidth,
      color: theme.color.elementsButtonText,
    },
  };

  const determineIcon = useCallback(() => {
    const color = props.focused ? styles.activeTab.color : props.color;
    switch (props.name) {
      case "explore":
        return <Binoculars size={props.size} color={color} />;
      case "saved":
        return <BookmarksSimple size={props.size} color={color} />;
      case "history":
        return <GlobeHemisphereEast size={props.size} color={color} />;
      case "chats":
        return <ChatCentered size={props.size} color={color} />;
      case "profile":
        return <UserCircle size={props.size} color={color} />;
      case "dashboard":
        return <House size={props.size} color={color} />;
      case "listings":
        return <ListDashes size={props.size} color={color} />;

      default:
        break;
    }
  }, [props.name, styles, props.size, props.focused, props.color]);

  return (
    <View
      style={[
        {
          height: props.size + 4,
          backgroundColor: props.focused ? props.color : "transparent",
          width: 16 * 2 + props.size,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          marginBottom: 8,
        },
        props.focused ? styles.activeTab : null,
      ]}
    >
      {determineIcon()}
    </View>
  );
}
