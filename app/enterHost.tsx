import { useTheme } from "@/hooks/useTheme";
import { Stack, useRouter } from "expo-router";
import { House, User } from "phosphor-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EnterHost() {
  const theme = useTheme();
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.appBackground,
      paddingTop: top + 24,
      paddingBottom: bottom + 24,
      paddingHorizontal: 16,
    },
    title: {
      fontSize: theme.fontSizes.xl_4,
      ...theme.fontStyles.bold,
      color: theme.color.appTextPrimary,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: theme.fontSizes.base,
      ...theme.fontStyles.regular,
      color: theme.color.appTextSecondary,
      textAlign: "center",
      marginBottom: 48,
    },
    cardContainer: {
      flex: 1,
      justifyContent: "center",
      gap: 24,
    },
    card: {
      backgroundColor: theme.color.appSurface,
      borderRadius: 24,
      padding: 24,
      alignItems: "center",
      shadowColor: theme.color.appDropShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    cardIcon: {
      marginBottom: 16,
      padding: 16,
      backgroundColor: theme.color.appBackground,
      borderRadius: 16,
    },
    cardTitle: {
      fontSize: theme.fontSizes.xl,
      ...theme.fontStyles.semiBold,
      color: theme.color.appTextPrimary,
      marginBottom: 8,
    },
    cardDescription: {
      fontSize: theme.fontSizes.base,
      ...theme.fontStyles.regular,
      color: theme.color.appTextSecondary,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.title}>Welcome to RealStay</Text>
      <Text style={styles.subtitle}>Choose how you want to use the app</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            while (router.canGoBack()) {
              router.back();
            }
            router.replace({ pathname: "/" });
          }}
        >
          <View style={styles.cardIcon}>
            <User size={32} color={theme.color.appPrimary} weight="fill" />
          </View>
          <Text style={styles.cardTitle}>I'm a Guest</Text>
          <Text style={styles.cardDescription}>
            Find and book amazing places to stay
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            while (router.canGoBack()) {
              router.back();
            }
            // @ts-expect-error it be like that sometimes
            router.replace({ pathname: "/agents" });
          }}
        >
          <View style={styles.cardIcon}>
            <House size={32} color={theme.color.appPrimary} weight="fill" />
          </View>
          <Text style={styles.cardTitle}>I'm a Host</Text>
          <Text style={styles.cardDescription}>
            List your property and manage bookings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
