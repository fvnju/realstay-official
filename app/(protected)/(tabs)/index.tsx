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
import { useQuery } from "@tanstack/react-query";
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

interface Owner {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  user_type: string;
  image_url?: string;
}

interface ApiListing {
  _id: string;
  place_holder_address: string;
  google_formatted_address: string;
  owner_id: string;
  state: string;
  lga: string;
  lat: number;
  lng: number;
  type: string;
  no_of_beds: number;
  no_of_bedrooms: number;
  no_of_bathrooms: number;
  are_pets_allowed: boolean;
  are_parties_allowed: boolean;
  extra_offerings: string[];
  title: string;
  description: string;
  cost: number;
  cost_cycle: string;
  photos: string[];
  status: string;
  owner: Owner;
  average_rating: number | null;
}

interface Listing {
  id: string;
  currency: string;
  dateRange: string;
  distance: string;
  imageUrl: string;
  location: string;
  price: string;
  rating: number;
  title: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
}

interface ApiResponse {
  data: {
    listings: ApiListing[];
    pagination: {
      total_items: number;
      total_pages: number;
      current_page: number;
      limit: number;
    };
  };
  success: boolean;
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

// Fetch listings from the API
const fetchListings = async () => {
  try {
    const response = await get<{ data: any }>("/listing", {
      requiresAuth: true,
    });

    console.log(response);

    if (response.data?.data?.listings) {
      const apiListings = response.data.data.listings as ApiListing[];
      return apiListings;
    }
  } catch (error) {
    console.error("Error fetching listings:", error);
    toast.error("Failed to load listings");
  }
  return [];
};

const HomeScreen = ({ usersName, userInfo }: HomeScreenProps) => {
  const sheetRef = useSheetRef();
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const { status, warmupServerManually } = useServerWarmup();

  const [search, setSearch] = useState("");
  const [searchListings, setSearchListings] = useState<Listing[]>([]);

  // Refs
  const searchRef = useRef<TextInput>(null);

  // Transform API listing to UI listing
  const transformListing = (apiListing: ApiListing): Listing => {
    return {
      id: apiListing._id,
      currency: "NGN", // Default currency
      dateRange: "Available", // Could be calculated based on availability
      distance: `${apiListing.state}, ${apiListing.lga}`, // Using state and LGA as location info
      imageUrl:
        apiListing.photos[0] || `house${Math.floor(Math.random() * 4) + 1}`, // First photo or fallback
      location: apiListing.place_holder_address,
      price: `${apiListing.cost.toLocaleString()}/${apiListing.cost_cycle}`,
      rating: apiListing.average_rating || 4.0,
      title: apiListing.title,
      type: apiListing.type,
      bedrooms: apiListing.no_of_bedrooms,
      bathrooms: apiListing.no_of_bathrooms,
    };
  };

  const { data, isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
  });

  // Search functionality
  const performSearch = useCallback(async (searchTerm: string) => {
    if (searchTerm.length === 0) {
      setSearchListings([]);
      return;
    }

    try {
      const response = await apiRequest<any>(`/listing`, {
        requiresAuth: true,
        // params: { search: searchTerm },
      });

      if (response.data?.data?.listings) {
        const apiListings = response.data.data.listings as ApiListing[];
        const transformedResults = apiListings.map(transformListing);
        setSearchListings(transformedResults);

        if (transformedResults.length === 0) {
          toast.error("No listings found for your search");
        }
      } else {
        setSearchListings([]);
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

  const isEmpty = data === undefined ? true : data.length === 0;
  const userType = "Guest"; //userInfo?.user_type ||

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
          <Text style={componentStyles.userType}>{userType.toLowerCase()}</Text>
        </View>
      </View>

      {/* Floating Search Button */}
      {/* <SearchButton
        theme={theme}
        width={width}
        onPress={() => sheetRef.current?.present()}
      /> */}

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
        loading={isLoading}
        status={status}
        isEmpty={isEmpty}
        listings={
          data === undefined ? [] : data.map((val) => transformListing(val))
        }
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
    searchResultsContainer: {
      paddingTop: 16,
    },
    emptyStateContainer: {
      padding: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyStateTitle: {
      fontSize: theme.fontSizes?.lg || 18,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.semiBold,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyStateText: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
      textAlign: "center",
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
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <ListingCard
                      onPress={() => {
                        router.push({
                          pathname: "/listing",
                          params: { id: item.id },
                        });
                      }}
                      currency={item.currency}
                      dateRange={item.dateRange}
                      distance={item.distance}
                      imageUrl={item.imageUrl}
                      location={item.location}
                      price={item.price}
                      rating={item.rating}
                    />
                  )}
                  ListEmptyComponent={
                    search.length > 0 ? (
                      <Text style={componentStyles.emptySearchText}>
                        Sorry, there's no listing like that
                      </Text>
                    ) : (
                      <Text style={componentStyles.emptySearchText}>
                        Start typing to search for listings
                      </Text>
                    )
                  }
                  contentContainerStyle={[
                    { paddingHorizontal: 16 },
                    componentStyles.searchResultsContainer,
                  ]}
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
  isEmpty,
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
      ) : isEmpty ? (
        <View style={componentStyles.emptyStateContainer}>
          <Text style={componentStyles.emptyStateTitle}>
            No listings available
          </Text>
          <Text style={componentStyles.emptyStateText}>
            Check back later for new property listings in your area.
          </Text>
        </View>
      ) : (
        listings.map((listing: Listing) => (
          <ListingCard
            key={listing.id}
            onPress={() => {
              router.push({
                pathname: "/listing",
                params: { id: listing.id },
              });
            }}
            currency={listing.currency}
            dateRange={listing.dateRange}
            distance={listing.distance}
            imageUrl={listing.imageUrl}
            location={listing.location}
            price={listing.price}
            rating={listing.rating}
          />
        ))
      )}
      <View style={{ height: 68 }} />
    </ScrollView>
  );
};
