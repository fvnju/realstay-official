import React, { useState } from "react";
import { Text, View, StyleSheet, Keyboard } from "react-native";
import { CaretDown } from "phosphor-react-native";
import { DropdownMenu, MenuOption } from "@/components/DropDown";
import { useTheme } from "@/hooks/useTheme";
import { PropertyTypeDropdownProps } from "../types";
import { PROPERTY_TYPES } from "../constants";

export const PropertyTypeDropdown: React.FC<PropertyTypeDropdownProps> = ({
  value,
  onChange,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const handleSelect = (newValue: string) => {
    setVisible(false);
    onChange(newValue as any);
  };

  return (
    <DropdownMenu
      itemsBackgroundColor={theme.colors.appSurface}
      visible={visible}
      handleOpen={() => {
        setVisible(true);
        Keyboard.dismiss();
      }}
      handleClose={() => setVisible(false)}
      trigger={
        <View
          style={[
            styles.trigger,
            {
              borderColor: theme.colors.elementsTextFieldBorder,
              backgroundColor: theme.colors.elementsTextFieldBackground,
            },
          ]}
        >
          <Text
            style={[
              styles.triggerText,
              theme.fontStyles.regular,
              { color: theme.colors.appTextSecondary },
            ]}
          >
            {value}
          </Text>
          <CaretDown
            weight="light"
            color={theme.colors.appTextSecondary}
            size={20}
          />
        </View>
      }
    >
      {PROPERTY_TYPES.map((type) => (
        <MenuOption key={type.value} onSelect={() => handleSelect(type.value)}>
          <Text
            style={[
              styles.optionText,
              theme.fontStyles.regular,
              { color: theme.colors.appTextPrimary },
            ]}
          >
            {type.label}
          </Text>
        </MenuOption>
      ))}
    </DropdownMenu>
  );
};

const styles = StyleSheet.create({
  trigger: {
    height: 48,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 8,
    alignSelf: "flex-start",
    borderWidth: 3,
  },
  triggerText: {
    fontSize: 16,
  },
  optionText: {
    fontSize: 16,
  },
});
