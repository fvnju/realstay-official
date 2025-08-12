import { useTheme } from "@/hooks/useTheme";
import { Minus, Plus } from "phosphor-react-native";
import { Fragment } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FormSection, useListingForm } from "./components";
import { FORM_LABELS } from "./constants";

export default function PropertyDetailsPage() {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();

  // Use Jotai form state
  const {
    bedrooms,
    bathrooms,
    beds,
    petsAllowed,
    partiesAllowed,
    setBedrooms,
    setBathrooms,
    setBeds,
    setPetsAllowed,
    setPartiesAllowed,
  } = useListingForm();

  const CounterInput = ({
    label,
    value,
    onIncrement,
    onDecrement,
    min = 0,
  }: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
  }) => (
    <View style={styles.counterContainer}>
      <Text
        style={[
          styles.counterLabel,
          { color: theme.colors.appTextPrimary },
          theme.fontStyles.medium,
        ]}
      >
        {label}
      </Text>
      <View style={styles.counterControls}>
        <TouchableOpacity
          style={[
            styles.counterButton,
            {
              backgroundColor: theme.colors.appSurface,
              borderColor: theme.colors.elementsTextFieldBorder,
              opacity: value <= min ? 0.5 : 1,
            },
          ]}
          onPress={onDecrement}
          disabled={value <= min}
          activeOpacity={0.7}
        >
          <Minus color={theme.colors.appTextPrimary} size={18} weight="bold" />
        </TouchableOpacity>
        <Text
          style={[
            styles.counterValue,
            { color: theme.colors.appTextPrimary },
            theme.fontStyles.semiBold,
          ]}
        >
          {value}
        </Text>
        <TouchableOpacity
          style={[
            styles.counterButton,
            {
              backgroundColor: theme.colors.appSurface,
              borderColor: theme.colors.elementsTextFieldBorder,
            },
          ]}
          onPress={onIncrement}
          activeOpacity={0.7}
        >
          <Plus color={theme.colors.appTextPrimary} size={18} weight="bold" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const ToggleSwitch = ({
    label,
    value,
    onToggle,
  }: {
    label: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View style={styles.toggleContainer}>
      <Text
        style={[
          styles.toggleLabel,
          { color: theme.colors.appTextPrimary },
          theme.fontStyles.medium,
        ]}
      >
        {label}
      </Text>
      <TouchableOpacity
        style={[
          styles.toggleSwitch,
          {
            backgroundColor: value
              ? theme.colors.appPrimary
              : theme.colors.elementsTextFieldBorder,
          },
        ]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.toggleThumb,
            {
              backgroundColor: "#fff",
              transform: [{ translateX: value ? 20 : 2 }],
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <Fragment>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInUp.delay(100).springify()}
          style={styles.headerContainer}
        >
          <Text
            style={[
              styles.title,
              { color: theme.colors.appTextPrimary },
              theme.fontStyles.bold,
            ]}
          >
            Property Details
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.appTextSecondary },
              theme.fontStyles.medium,
            ]}
          >
            Tell us more about your property to help guests find the perfect
            match
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.formContainer}
        >
          <FormSection label="Room Configuration">
            <View style={styles.countersGroup}>
              <CounterInput
                label={FORM_LABELS.bedrooms}
                value={bedrooms}
                onIncrement={() => setBedrooms(bedrooms + 1)}
                onDecrement={() => setBedrooms(Math.max(1, bedrooms - 1))}
                min={1}
              />
              <CounterInput
                label={FORM_LABELS.bathrooms}
                value={bathrooms}
                onIncrement={() => setBathrooms(bathrooms + 1)}
                onDecrement={() => setBathrooms(Math.max(1, bathrooms - 1))}
                min={1}
              />
              <CounterInput
                label={FORM_LABELS.beds}
                value={beds}
                onIncrement={() => setBeds(beds + 1)}
                onDecrement={() => setBeds(Math.max(1, beds - 1))}
                min={1}
              />
            </View>
          </FormSection>

          <FormSection label="House Rules">
            <View style={styles.togglesGroup}>
              <ToggleSwitch
                label={FORM_LABELS.petsAllowed}
                value={petsAllowed}
                onToggle={() => setPetsAllowed(!petsAllowed)}
              />
              <ToggleSwitch
                label={FORM_LABELS.partiesAllowed}
                value={partiesAllowed}
                onToggle={() => setPartiesAllowed(!partiesAllowed)}
              />
            </View>
          </FormSection>
        </Animated.View>
      </ScrollView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  formContainer: {
    gap: 32,
  },
  countersGroup: {
    gap: 20,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  counterLabel: {
    fontSize: 16,
    flex: 1,
  },
  counterControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  counterValue: {
    fontSize: 18,
    minWidth: 24,
    textAlign: "center",
  },
  togglesGroup: {
    gap: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 16,
    flex: 1,
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    position: "relative",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
  },
});
