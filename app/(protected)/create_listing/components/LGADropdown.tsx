import { useTheme } from "@/hooks/useTheme";
import { CaretDown, Check } from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { NigerianState, STATE_LGAS } from "../constants";

interface LGADropdownProps {
  value: string;
  onChange: (value: string) => void;
  selectedState: NigerianState | "";
  placeholder?: string;
}

export const LGADropdown: React.FC<LGADropdownProps> = ({
  value,
  onChange,
  selectedState,
  placeholder = "Select LGA",
}) => {
  const theme = useTheme();

  const availableLGAs = selectedState ? STATE_LGAS[selectedState] || [] : [];
  const isDisabled = !selectedState || availableLGAs.length === 0;

  const getPlaceholderText = () => {
    if (!selectedState) return "Select a state first";
    if (availableLGAs.length === 0) return "No LGAs available for this state";
    return placeholder;
  };

  const renderItem = (item: (typeof availableLGAs)[number]) => {
    const isSelected = value === item.value;
    return (
      <View
        style={[
          styles.item,
          {
            backgroundColor: isSelected
              ? theme.colors.appPrimary + "15"
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
      style={[
        styles.dropdown,
        {
          backgroundColor: isDisabled
            ? theme.colors.elementsButtonDisabled + "20"
            : theme.colors.appSurface,
          borderColor: value
            ? theme.colors.appPrimary
            : theme.colors.elementsTextFieldBorder,
          opacity: isDisabled ? 0.6 : 1,
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
      data={availableLGAs}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={getPlaceholderText()}
      value={value}
      onChange={(item) => onChange(item.value)}
      renderRightIcon={renderRightIcon}
      renderItem={renderItem}
      disable={isDisabled}
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
