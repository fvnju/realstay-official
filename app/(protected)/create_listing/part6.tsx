import { useTheme } from "@/hooks/useTheme";
import { useStore } from "@nanostores/react";
import { Calendar, CurrencyNgn } from "phosphor-react-native";
import { Fragment } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { $listingSubmision } from ".";
import { FormSection } from "./components";
import { FORM_LABELS, PAYMENT_CYCLES } from "./constants";
import { ListingFormData } from "./types";

export default function PricingPage() {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();

  // Use Jotai form state
  const { price, paymentCycle } = useStore($listingSubmision);

  function setPaymentCycle(ans: ListingFormData["paymentCycle"]) {
    $listingSubmision.setKey("paymentCycle", ans);
  }
  function handlePriceChange(ans: string) {
    $listingSubmision.setKey("price", Number(ans));
  }

  // Format price for display
  const formatPriceForDisplay = (value: number) => {
    return value > 0 ? value.toLocaleString() : "";
  };

  const PaymentCycleOption = ({
    cycle,
    isSelected,
    onSelect,
  }: {
    cycle: (typeof PAYMENT_CYCLES)[number];
    isSelected: boolean;
    onSelect: () => void;
  }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
      scale.value = withSpring(0.95, { duration: 100 }, () => {
        scale.value = withSpring(1, { duration: 200 });
      });
      onSelect();
    };

    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.cycleOption,
            {
              backgroundColor: isSelected
                ? theme.colors.appPrimary + "15"
                : theme.colors.appSurface,
              borderColor: isSelected
                ? theme.colors.appPrimary
                : theme.colors.elementsTextFieldBorder,
              shadowColor: theme.colors.appDropShadow,
            },
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View style={styles.cycleContent}>
            <View
              style={[
                styles.cycleIconContainer,
                {
                  backgroundColor: isSelected
                    ? theme.colors.appPrimary + "20"
                    : theme.colors.surfaceSecondary,
                },
              ]}
            >
              <Calendar
                color={
                  isSelected
                    ? theme.colors.appPrimary
                    : theme.colors.appTextSecondary
                }
                size={20}
                weight="bold"
              />
            </View>
            <Text
              style={[
                styles.cycleLabel,
                {
                  color: isSelected
                    ? theme.colors.appPrimary
                    : theme.colors.appTextPrimary,
                },
                theme.fontStyles.semiBold,
              ]}
            >
              {cycle.label}
            </Text>
            {isSelected && (
              <View
                style={[
                  styles.selectedIndicator,
                  { backgroundColor: theme.colors.appPrimary },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Calculate example earnings
  const getExampleEarnings = () => {
    if (price === 0) return null;

    const multipliers = {
      daily: { monthly: 30, yearly: 365 },
      weekly: { monthly: 4.33, yearly: 52 },
      monthly: { monthly: 1, yearly: 12 },
      yearly: { monthly: 1 / 12, yearly: 1 },
    };

    const monthly = Math.round(price * multipliers[paymentCycle].monthly);
    const yearly = Math.round(price * multipliers[paymentCycle].yearly);

    return { monthly, yearly };
  };

  const earnings = getExampleEarnings();

  return (
    <Fragment>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: bottom + 120,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            entering={FadeInUp.delay(100).springify()}
            style={styles.headerContainer}
          >
            <View
              style={[
                styles.headerIconContainer,
                { backgroundColor: theme.colors.appPrimary + "20" },
              ]}
            >
              <CurrencyNgn
                color={theme.colors.appPrimary}
                size={32}
                weight="bold"
              />
            </View>
            <Text
              style={[
                styles.title,
                { color: theme.colors.appTextPrimary },
                theme.fontStyles.bold,
              ]}
            >
              Set Your Price
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.appTextSecondary },
                theme.fontStyles.medium,
              ]}
            >
              Set a competitive price and choose how often guests will pay
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={styles.formContainer}
          >
            <FormSection label={FORM_LABELS.price} hint={FORM_LABELS.priceHint}>
              <View style={styles.priceInputContainer}>
                <View
                  style={[
                    styles.currencyPrefix,
                    {
                      backgroundColor: theme.colors.appPrimary + "10",
                      borderColor:
                        price > 0
                          ? theme.colors.appPrimary
                          : theme.colors.elementsTextFieldBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.currencySymbol,
                      { color: theme.colors.appPrimary },
                      theme.fontStyles.semiBold,
                    ]}
                  >
                    ₦
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.priceInput,
                    {
                      backgroundColor: theme.colors.appSurface,
                      borderColor:
                        price > 0
                          ? theme.colors.appPrimary
                          : theme.colors.elementsTextFieldBorder,
                      color: theme.colors.appTextPrimary,
                    },
                    theme.fontStyles.semiBold,
                  ]}
                  placeholder="0"
                  placeholderTextColor={theme.colors.appTextSecondary}
                  defaultValue={price.toString()}
                  onChangeText={handlePriceChange}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </FormSection>

            <FormSection
              label={FORM_LABELS.paymentCycle}
              hint={FORM_LABELS.paymentCycleHint}
            >
              <View style={styles.cycleGrid}>
                {PAYMENT_CYCLES.map((cycle) => (
                  <PaymentCycleOption
                    key={cycle.value}
                    cycle={cycle}
                    isSelected={paymentCycle === cycle.value}
                    onSelect={() => setPaymentCycle(cycle.value)}
                  />
                ))}
              </View>
            </FormSection>

            {earnings && (
              <Animated.View
                entering={FadeInDown.delay(400).springify()}
                style={[
                  styles.earningsContainer,
                  {
                    backgroundColor:
                      theme.colors.status?.success + "10" || "#10B981" + "10",
                    borderColor:
                      theme.colors.status?.success + "30" || "#10B981" + "30",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.earningsTitle,
                    { color: theme.colors.status?.success || "#10B981" },
                    theme.fontStyles.semiBold,
                  ]}
                >
                  💰 Potential Earnings
                </Text>
                <View style={styles.earningsList}>
                  <View style={styles.earningsItem}>
                    <Text
                      style={[
                        styles.earningsLabel,
                        { color: theme.colors.appTextSecondary },
                        theme.fontStyles.medium,
                      ]}
                    >
                      Monthly:
                    </Text>
                    <Text
                      style={[
                        styles.earningsValue,
                        { color: theme.colors.appTextPrimary },
                        theme.fontStyles.bold,
                      ]}
                    >
                      ₦{earnings.monthly.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.earningsItem}>
                    <Text
                      style={[
                        styles.earningsLabel,
                        { color: theme.colors.appTextSecondary },
                        theme.fontStyles.medium,
                      ]}
                    >
                      Yearly:
                    </Text>
                    <Text
                      style={[
                        styles.earningsValue,
                        { color: theme.colors.appTextPrimary },
                        theme.fontStyles.bold,
                      ]}
                    >
                      ₦{earnings.yearly.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* Pricing Tips */}
            <Animated.View
              entering={FadeInDown.delay(500).springify()}
              style={[
                styles.tipsContainer,
                {
                  backgroundColor: theme.colors.appPrimary + "10",
                  borderColor: theme.colors.appPrimary + "30",
                },
              ]}
            >
              <Text
                style={[
                  styles.tipsTitle,
                  { color: theme.colors.appPrimary },
                  theme.fontStyles.semiBold,
                ]}
              >
                💡 Pricing Tips
              </Text>
              <View style={styles.tipsList}>
                <Text
                  style={[
                    styles.tipItem,
                    { color: theme.colors.appTextSecondary },
                    theme.fontStyles.medium,
                  ]}
                >
                  • Research similar properties in your area
                </Text>
                <Text
                  style={[
                    styles.tipItem,
                    { color: theme.colors.appTextSecondary },
                    theme.fontStyles.medium,
                  ]}
                >
                  • Consider seasonal demand fluctuations
                </Text>
                <Text
                  style={[
                    styles.tipItem,
                    { color: theme.colors.appTextSecondary },
                    theme.fontStyles.medium,
                  ]}
                >
                  • Factor in your property's unique amenities
                </Text>
                <Text
                  style={[
                    styles.tipItem,
                    { color: theme.colors.appTextSecondary },
                    theme.fontStyles.medium,
                  ]}
                >
                  • You can always adjust prices later
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  formContainer: {
    gap: 32,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  currencyPrefix: {
    borderWidth: 2,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderRightWidth: 0,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  currencySymbol: {
    fontSize: 20,
  },
  priceInput: {
    flex: 1,
    borderWidth: 2,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 20,
    textAlign: "right",
  },
  cycleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cycleOption: {
    flex: 1,
    minWidth: "45%",
    borderWidth: 2,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cycleContent: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    position: "relative",
  },
  cycleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cycleLabel: {
    fontSize: 16,
    textAlign: "center",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  earningsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  earningsTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  earningsList: {
    gap: 8,
  },
  earningsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  earningsLabel: {
    fontSize: 14,
  },
  earningsValue: {
    fontSize: 16,
  },
  tipsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    fontSize: 14,
    lineHeight: 20,
  },
});
