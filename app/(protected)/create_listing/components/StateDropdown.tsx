import { useTheme } from "@/hooks/useTheme";
import { CaretDown, Check } from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { NIGERIAN_STATES, NigerianState } from "../constants";

interface StateDropdownProps {
  value: NigerianState | "";
  onChange: (value: NigerianState) => void;
  placeholder?: string;
}

export const StateDropdown: React.FC<StateDropdownProps> = ({
  value,
  onChange,
  placeholder = "Select a state",
}) => {
  const theme = useTheme();

  const renderItem = (item: (typeof NIGERIAN_STATES)[number]) => {
    const isSelected = value === item.value;
    return (
      <View
        style={[
          styles.item,
          {
            backgroundColor: isSelected
              ? theme.colors.appPrimary + "65"
              : "transparent",
          },
        ]}
      >
        <Text
          style={[
            styles.itemText,
            {
              color: isSelected
                ? theme.colors.appPrimary
                : theme.colors.appTextPrimary,
            },
            theme.fontStyles.medium,
          ]}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Check color={theme.colors.appPrimary} size={20} weight="bold" />
        )}
      </View>
    );
  };

  const renderRightIcon = () => (
    <CaretDown color={theme.colors.appTextSecondary} size={16} weight="bold" />
  );

  return (
    <Dropdown
      closeModalWhenSelectedItem
      style={[
        styles.dropdown,
        {
          backgroundColor: theme.colors.appSurface,
          borderColor: value
            ? theme.colors.appPrimary
            : theme.colors.elementsTextFieldBorder,
        },
      ]}
      placeholderStyle={[
        styles.placeholderStyle,
        {
          color: theme.colors.appTextSecondary,
        },
        theme.fontStyles.medium,
      ]}
      selectedTextStyle={[
        styles.selectedTextStyle,
        {
          color: theme.colors.appTextPrimary,
        },
        theme.fontStyles.medium,
      ]}
      containerStyle={[
        styles.containerStyle,
        {
          backgroundColor: theme.colors.appSurface,
          borderColor: theme.colors.elementsTextFieldBorder,
          shadowColor: theme.colors.appDropShadow,
        },
      ]}
      data={NIGERIAN_STATES}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={(item) => onChange(item.value)}
      renderRightIcon={renderRightIcon}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderRadius: 12,
    minHeight: 56,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  containerStyle: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
});
