import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { Stack, useRouter } from "expo-router";
import { ArrowRight, House, User } from "phosphor-react-native";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Animated Card Component
const AnimatedCard = ({
  icon,
  title,
  description,
  onPress,
  theme,
  isPrimary = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
  theme: any;
  isPrimary?: boolean;
}) => {
  const scale = useSharedValue(1);
  const { width } = Dimensions.get("window");

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const cardStyles = StyleSheet.create({
    card: {
      backgroundColor: isPrimary ? theme.colors.primary : theme.colors.surface,
      borderRadius: 20,
      padding: 24,
      marginHorizontal: 4,
      minHeight: 180,
      justifyContent: "space-between",
      ...theme.shadows.lg,
      borderWidth: isPrimary ? 0 : 1,
      borderColor: theme.colors.border,
    },
    iconContainer: {
      alignSelf: "flex-start",
      padding: 12,
      backgroundColor: isPrimary
        ? "rgba(255,255,255,0.2)"
        : theme.colors.primary + "15",
      borderRadius: 12,
      marginBottom: 16,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: theme.fontSizes.h3,
      ...theme.fontStyles.bold,
      color: isPrimary ? "#ffffff" : theme.colors.text.primary,
      marginBottom: 8,
    },
    description: {
      fontSize: theme.fontSizes.sm,
      ...theme.fontStyles.regular,
      color: isPrimary ? "rgba(255,255,255,0.9)" : theme.colors.text.secondary,
      lineHeight: theme.fontSizes.sm * 1.4,
      marginBottom: 16,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      position: "absolute",
      top: 16,
      right: 16,
      gap: 8,
    },
    actionText: {
      fontSize: theme.fontSizes.sm,
      ...theme.fontStyles.semiBold,
      color: isPrimary ? "#ffffff" : theme.colors.primary,
    },
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={cardStyles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={cardStyles.content}>
          <View style={cardStyles.iconContainer}>{icon}</View>
          <Text style={cardStyles.title}>{title}</Text>
          <Text style={cardStyles.description}>{description}</Text>
        </View>

        <View style={cardStyles.footer}>
          <Text style={cardStyles.actionText}>Get Started</Text>
          <ArrowRight
            size={16}
            color={isPrimary ? "#ffffff" : theme.colors.primary}
            weight="bold"
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function EnterHost() {
  const theme = useTheme();
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const styles = createThemedStyles(theme);

  const componentStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: top + 32,
      paddingBottom: bottom + 24,
      paddingHorizontal: 20,
    },
    header: {
      alignItems: "center",
      marginBottom: 0,
    },
    title: {
      fontSize: theme.fontSizes.display,
      ...theme.fontStyles.bold,
      color: theme.colors.text.primary,
      textAlign: "center",
      marginBottom: 12,
      letterSpacing: theme.letterSpacing.tight * theme.fontSizes.display,
      lineHeight: theme.fontSizes.display,
    },
    subtitle: {
      fontSize: theme.fontSizes.h1,
      ...theme.fontStyles.bold,
      color: theme.colors.text.secondary,
      textAlign: "center",
      lineHeight: theme.fontSizes.h1,
    },
    cardContainer: {
      flex: 1,
      justifyContent: "center",
      gap: 20,
    },
    brandingContainer: {
      alignItems: "center",
      marginTop: 0,
    },
    brandingText: {
      fontSize: theme.fontSizes.xs,
      ...theme.fontStyles.medium,
      color: theme.colors.text.secondary,
      opacity: 0.7,
    },
  });

  return (
    <View style={componentStyles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={componentStyles.header}>
        <Text style={componentStyles.subtitle}>
          Choose how you want to use the app
        </Text>
      </View>

      <View style={componentStyles.cardContainer}>
        <AnimatedCard
          icon={<User size={28} color={theme.colors.primary} weight="fill" />}
          title="I'm a Guest"
          description="Discover and book amazing places to stay for your next adventure"
          onPress={() => {
            router.replace({ pathname: "/" });
          }}
          theme={theme}
          isPrimary={true}
        />

        <AnimatedCard
          icon={<House size={28} color={theme.colors.primary} weight="fill" />}
          title="I'm a Host"
          description="List your property and start earning by hosting travelers"
          onPress={() => {
            router.replace({ pathname: "/agents" });
          }}
          theme={theme}
          isPrimary={false}
        />
      </View>

      <View style={componentStyles.brandingContainer}>
        <Text style={componentStyles.brandingText}>
          Your journey starts here
        </Text>
      </View>
    </View>
  );
}
