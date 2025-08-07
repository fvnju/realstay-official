import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import ListingCard from "@/components/ListingCard";
import { Sheet, useSheetRef } from "@/components/sheet";
import TextField from "@/components/TextField";
import { createThemedStyles } from "@/constants/themes";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest, get } from "@/utils/apiClient";
import { useServerWarmup } from "@/utils/serverWarmup";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { ArrowLeft, MagnifyingGlass } from "phosphor-react-native";
import {
  FlatList,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";

// Types
interface UserInfo {
  first_name: string;
  last_name: string;
  email?: string;
  user_type?: string;
}

interface Listing {
  id: string;
  currency?: string;
  dateRange?: string;
  distance?: string;
  imageUrl?: string;
  location?: string;
  price?: string;
  rating?: number;
}

// Loading component
const LoadingScreen = ({ message }: { message: string }) => {
  const theme = useTheme();
  const styles = createThemedStyles(theme);

  return (
    <View
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.textSecondary, { marginTop: 16 }]}>{message}</Text>
    </View>
  );
};

export default function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { status } = useServerWarmup();

  const loadUserInfo = useCallback(async () => {
    try {
      const userString = await SecureStore.getItemAsync("user_info");
      if (userString) {
        setUserInfo(JSON.parse(userString));
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      toast.error("Could not load user information");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  if (loading || status === "warming-up") {
    return (
      <LoadingScreen
        message={status === "warming-up" ? "Waking up server..." : "Loading..."}
      />
    );
  }

  const displayName = userInfo
    ? `${userInfo.first_name} ${userInfo.last_name}`
    : "Guest User";

  return <HomeScreen usersName={displayName} userInfo={userInfo} />;
}

interface HomeScreenProps {
  usersName: string;
  userInfo: UserInfo | null;
}

const HomeScreen = ({ usersName, userInfo }: HomeScreenProps) => {
  const sheetRef = useSheetRef();
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const { status, warmupServerManually } = useServerWarmup();

  // State
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchListings, setSearchListings] = useState<Listing[]>([]);

  // Refs
  const searchRef = useRef<TextInput>(null);

  // Fetch listings from the API
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get("/listings", {
        requiresAuth: false,
        handleColdStart: true,
      });

      if (response.data) {
        setListings(response.data as Listing[]);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, []);

  // Search functionality
  const performSearch = useCallback(async (searchTerm: string) => {
    if (searchTerm.length === 0) {
      setSearchListings([]);
      return;
    }

    try {
      const response = await apiRequest("/listing", { requiresAuth: true });
      const results = ((response.data as any)?.listings as Listing[]) || [];

      setSearchListings(results);

      if (results.length === 0) {
        toast.error("No listings found for your search");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed");
    }
  }, []);

  // Load listings when component mounts or server becomes ready
  useEffect(() => {
    if (status === "ready") {
      fetchListings();
    }
  }, [status, fetchListings]);

  // Debounced search
  useDebouncedEffect(
    () => {
      performSearch(search);
    },
    500,
    [search, performSearch]
  );

  const isDummy = listings.length === 0;
  const userType = userInfo?.user_type || "Guest";

  return (
    <View
      style={[
        styles.container,
        componentStyles.mainContainer,
        { paddingTop: top + 24 },
      ]}
    >
      {/* Header */}
      <View style={componentStyles.header}>
        <View style={componentStyles.userInfo}>
          <Text style={componentStyles.greeting}>Hello</Text>
          <View style={componentStyles.userRow}>
            <View style={componentStyles.onlineIndicator} />
            <Text style={styles.text}>{usersName}</Text>
          </View>
        </View>

        <View style={componentStyles.userTypeContainer}>
          <Text style={styles.textSecondary}>Logged in as</Text>
          <Text style={componentStyles.userType}>guest</Text>
        </View>
      </View>

      {/* Floating Search Button */}
      <SearchButton
        theme={theme}
        width={width}
        onPress={() => sheetRef.current?.present()}
      />

      {/* Search Sheet */}
      <SearchSheet
        ref={sheetRef}
        theme={theme}
        height={height}
        top={top}
        bottom={bottom}
        search={search}
        setSearch={setSearch}
        searchRef={searchRef}
        searchListings={searchListings}
      />

      {/* Listings Content */}
      <ListingsContent
        loading={loading}
        status={status}
        isDummy={isDummy}
        listings={listings}
        theme={theme}
        bottom={bottom}
        warmupServerManually={warmupServerManually}
      />
    </View>
  );
};

// Component styles
const createComponentStyles = (theme: any) =>
  StyleSheet.create({
    mainContainer: {
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 16,
      marginBottom: 8,
      borderBottomColor: theme.colors?.border || "#e5e5ea",
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    userInfo: {
      gap: 4,
    },
    greeting: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes?.h1 || 34,
      color: theme.colors?.text?.primary || "#000",
      letterSpacing:
        (theme.letterSpacing?.tight || -0.02) * (theme.fontSizes?.h1 || 34),
    },
    userRow: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    onlineIndicator: {
      backgroundColor: theme.colors?.status?.success || "#1fc16b",
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    userTypeContainer: {
      alignItems: "flex-end",
      paddingTop: 20,
    },
    userType: {
      fontSize: theme.fontSizes?.h3 || 24,
      color: theme.colors?.primary || "#0078ff",
      ...theme.fontStyles.semiBold,
    },
    searchButton: {
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      zIndex: 1,
      bottom: 24,
      backgroundColor: theme.colors?.surface || "#ffffff",
      borderRadius: 26,
      ...(theme.shadows?.lg || {}),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors?.border || "#e5e5ea",
    },
    searchButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      gap: 8,
      flex: 1,
    },
    searchButtonText: {
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes?.sm || 14,
      letterSpacing:
        (theme.letterSpacing?.loose || 0.01) * (theme.fontSizes?.sm || 14),
    },
    listingsContainer: {
      flexShrink: 0,
      marginTop: 24,
      marginBottom: 100,
      paddingHorizontal: 4,
    },
    loadingContainer: {
      padding: 20,
      alignItems: "center",
    },
    loadingText: {
      marginTop: 12,
    },
    errorContainer: {
      padding: 20,
      alignItems: "center",
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    retryButtonText: {
      color: theme.colors.button.text,
      fontWeight: "600",
    },
    searchSheetHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      height: 48,
      width: 72,
      alignItems: "center",
      flexDirection: "row",
      paddingLeft: 24,
    },
    searchTitle: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes?.h2 || 28,
      color: theme.colors?.text?.primary || "#000",
      letterSpacing:
        (theme.letterSpacing?.tight || -0.02) * (theme.fontSizes?.h2 || 28),
    },
    searchInputContainer: {
      justifyContent: "flex-end",
      paddingHorizontal: 20,
    },
    emptySearchText: {
      fontSize: 16,
      color: theme.colors?.text?.secondary || "#666",
      textAlign: "center",
      ...theme.fontStyles.regular,
      padding: 40,
      lineHeight: 24,
    },
  });

// Search Button Component
const SearchButton = ({ theme, width, onPress }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -50 }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 12, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const componentStyles = createComponentStyles(theme);

  return (
    <Animated.View
      style={[componentStyles.searchButton, { left: width / 2 }, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        style={componentStyles.searchButtonContent}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <MagnifyingGlass
          size={18}
          weight="bold"
          color={theme.colors?.text?.primary || "#000"}
        />
        <Text style={componentStyles.searchButtonText}>Search</Text>
      </Pressable>
    </Animated.View>
  );
};

// Search Sheet Component
const SearchSheet = React.forwardRef<any, any>(
  (
    {
      theme,
      height,
      top,
      bottom,
      search,
      setSearch,
      searchRef,
      searchListings,
    },
    ref
  ) => {
    const componentStyles = createComponentStyles(theme);

    return (
      <Sheet
        ref={ref}
        onDismiss={Keyboard.dismiss}
        overDragResistanceFactor={0}
      >
        <BottomSheetView style={{ height, paddingTop: top - 28 }}>
          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
              <View style={componentStyles.searchSheetHeader}>
                <TouchableOpacity
                  style={componentStyles.backButton}
                  onPress={() => (ref as any).current?.dismiss()}
                >
                  <ArrowLeft
                    weight="bold"
                    size={24}
                    color={theme.colors?.text?.primary || "#000"}
                  />
                </TouchableOpacity>
                <Text style={componentStyles.searchTitle}>Where to?</Text>
              </View>

              <View style={{ flex: 1 }}>
                <FlatList
                  scrollEnabled
                  centerContent
                  data={searchListings}
                  renderItem={({ item, index }) => (
                    <Text>{String(item) + index.toString()}</Text>
                  )}
                  ListEmptyComponent={
                    <Text style={componentStyles.emptySearchText}>
                      Sorry, there's no listing like that
                    </Text>
                  }
                />
              </View>

              <View
                style={[
                  componentStyles.searchInputContainer,
                  { paddingBottom: bottom + 32 },
                ]}
              >
                <TextField
                  ref={searchRef}
                  autoFocus
                  placeholder="Tap to search..."
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setSearch}
                  stateValue={search}
                  clearFunc={() => {
                    setSearch("");
                    searchRef.current?.clear();
                  }}
                />
              </View>
            </KeyboardAvoidingView>
          </Pressable>
        </BottomSheetView>
      </Sheet>
    );
  }
);

// Listings Content Component
const ListingsContent = ({
  loading,
  status,
  isDummy,
  listings,
  theme,
  bottom,
  warmupServerManually,
}: any) => {
  const componentStyles = createComponentStyles(theme);
  const styles = createThemedStyles(theme);

  return (
    <ScrollView
      style={[
        componentStyles.listingsContainer,
        { marginBottom: 100 - bottom },
      ]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {loading ? (
        <View style={componentStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.textSecondary, componentStyles.loadingText]}>
            Loading listings...
          </Text>
        </View>
      ) : status === "error" ? (
        <View style={componentStyles.errorContainer}>
          <Text style={[styles.textSecondary, { marginBottom: 16 }]}>
            Unable to connect to server
          </Text>
          <TouchableOpacity
            style={componentStyles.retryButton}
            onPress={warmupServerManually}
          >
            <Text style={componentStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isDummy ? (
        Array.from({ length: 4 }).map((_, index) => (
          <ListingCard
            key={`demo-${index}`}
            onPress={() => {
              router.push({
                pathname: "/listing",
                params: { demoNumber: (index + 1).toString() },
              });
            }}
            currency="NGN"
            dateRange="12-14"
            distance="10km"
            imageUrl={`house${index + 1}`}
            location="London"
            price="5000"
            rating={4.5}
          />
        ))
      ) : (
        listings.map((listing: Listing, index: number) => (
          <ListingCard
            key={listing.id || `listing-${index}`}
            currency={listing.currency || "NGN"}
            dateRange={listing.dateRange || "Available"}
            distance={listing.distance || "Unknown"}
            imageUrl={listing.imageUrl || `house${(index % 4) + 1}`}
            location={listing.location || "Unknown"}
            price={listing.price || "Contact"}
            rating={listing.rating || 4.0}
          />
        ))
      )}
      <View style={{ height: 68 }} />
    </ScrollView>
  );
};
