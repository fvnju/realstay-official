import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createThemedStyles } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import {
  Calendar,
  ClockCounterClockwise,
  House,
  MapPin,
  Receipt,
  Star,
} from "phosphor-react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

// Types
interface HistoryItem {
  id: string;
  type: "booking" | "purchase";
  title: string;
  location: string;
  date: string;
  status: "completed" | "cancelled" | "upcoming";
  price: string;
  rating?: number;
  image?: string;
}

// Filter tabs
const FILTER_TABS = [
  { id: "all", label: "All", icon: Receipt },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "purchases", label: "Purchases", icon: House },
] as const;

// Filter Tab Component
const FilterTab = ({
  tab,
  isActive,
  onPress,
  theme,
}: {
  tab: (typeof FILTER_TABS)[number];
  isActive: boolean;
  onPress: () => void;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);
  const IconComponent = tab.icon;

  return (
    <TouchableOpacity
      style={[
        componentStyles.filterTab,
        isActive && componentStyles.filterTabActive,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <IconComponent
        size={16}
        color={
          isActive ? theme.colors.text.inverse : theme.colors.text.secondary
        }
        weight="regular"
      />
      <Text
        style={[
          componentStyles.filterTabText,
          isActive && componentStyles.filterTabTextActive,
        ]}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
};

// History Item Component
const HistoryItemComponent = ({
  item,
  theme,
}: {
  item: HistoryItem;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);

  const getStatusColor = (status: HistoryItem["status"]) => {
    switch (status) {
      case "completed":
        return theme.colors.status.success;
      case "cancelled":
        return theme.colors.status.error;
      case "upcoming":
        return theme.colors.primary;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: HistoryItem["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "upcoming":
        return "Upcoming";
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity style={componentStyles.historyItem} activeOpacity={0.7}>
      {/* Property Image Placeholder */}
      <View style={componentStyles.itemImage}>
        <House size={24} color={theme.colors.text.secondary} weight="light" />
      </View>

      {/* Content */}
      <View style={componentStyles.itemContent}>
        <View style={componentStyles.itemHeader}>
          <Text style={componentStyles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text
            style={[
              componentStyles.itemStatus,
              { color: getStatusColor(item.status) },
            ]}
          >
            {getStatusText(item.status)}
          </Text>
        </View>

        <View style={componentStyles.itemDetails}>
          <MapPin
            size={14}
            color={theme.colors.text.secondary}
            weight="regular"
          />
          <Text style={componentStyles.itemLocation} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <View style={componentStyles.itemFooter}>
          <Text style={componentStyles.itemDate}>{item.date}</Text>
          <Text style={componentStyles.itemPrice}>{item.price}</Text>
        </View>

        {item.rating && (
          <View style={componentStyles.itemRating}>
            <Star size={12} color={theme.colors.accent} weight="fill" />
            <Text style={componentStyles.ratingText}>
              {item.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Empty State Component
const EmptyState = ({
  activeFilter,
  theme,
}: {
  activeFilter: string;
  theme: any;
}) => {
  const componentStyles = createComponentStyles(theme);

  const getEmptyStateContent = () => {
    switch (activeFilter) {
      case "bookings":
        return {
          icon: (
            <Calendar
              size={64}
              color={theme.colors.text.secondary}
              weight="light"
            />
          ),
          title: "No bookings yet",
          subtitle:
            "Your booking history will appear here once you start staying at properties",
        };
      case "purchases":
        return {
          icon: (
            <House
              size={64}
              color={theme.colors.text.secondary}
              weight="light"
            />
          ),
          title: "No purchases yet",
          subtitle: "Your property purchase history will appear here",
        };
      default:
        return {
          icon: (
            <ClockCounterClockwise
              size={64}
              color={theme.colors.text.secondary}
              weight="light"
            />
          ),
          title: "No history yet",
          subtitle:
            "Your booking and purchase history will appear here as you use the app",
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <View style={componentStyles.emptyContainer}>
      <View style={componentStyles.emptyIcon}>{content.icon}</View>
      <Text style={componentStyles.emptyTitle}>{content.title}</Text>
      <Text style={componentStyles.emptySubtitle}>{content.subtitle}</Text>
    </View>
  );
};

export default function HistoryScreen() {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const componentStyles = createComponentStyles(theme);

  // State
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [historyItems] = useState<HistoryItem[]>([
    // Mock data - replace with actual API data
    // {
    //   id: "1",
    //   type: "booking",
    //   title: "Luxury Apartment in Victoria Island",
    //   location: "Lagos, Nigeria",
    //   date: "Dec 15-18, 2024",
    //   status: "completed",
    //   price: "₦45,000",
    //   rating: 4.8,
    // },
  ]);

  const filteredItems = historyItems.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "bookings") return item.type === "booking";
    if (activeFilter === "purchases") return item.type === "purchase";
    return true;
  });

  const renderHistoryItem = useCallback(
    ({ item }: { item: HistoryItem }) => (
      <HistoryItemComponent item={item} theme={theme} />
    ),
    [theme]
  );

  const keyExtractor = useCallback((item: HistoryItem) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: top + 24 }]}>
      {/* Header */}
      <View style={componentStyles.header}>
        <Text style={componentStyles.headerTitle}>History</Text>
      </View>

      {/* Filter Tabs */}
      <View style={componentStyles.filterContainer}>
        {FILTER_TABS.map((tab) => (
          <FilterTab
            key={tab.id}
            tab={tab}
            isActive={activeFilter === tab.id}
            onPress={() => setActiveFilter(tab.id)}
            theme={theme}
          />
        ))}
      </View>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <EmptyState activeFilter={activeFilter} theme={theme} />
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderHistoryItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={componentStyles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={componentStyles.separator} />
          )}
        />
      )}
    </View>
  );
}
// Component styles
const createComponentStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: 24,
      paddingBottom: 16,
    },
    headerTitle: {
      ...theme.fontStyles.semiBold,
      fontSize: theme.fontSizes?.h1 || 48,
      color: theme.colors?.text?.primary || "#000",
      letterSpacing:
        (theme.letterSpacing?.tight || -0.02) * (theme.fontSizes?.h1 || 48),
    },
    filterContainer: {
      flexDirection: "row",
      paddingHorizontal: 24,
      gap: 12,
      marginBottom: 24,
    },
    filterTab: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: theme.borderRadius?.full || 20,
      backgroundColor: theme.colors?.surface || "#ffffff",
      borderWidth: 1,
      borderColor: theme.colors?.border || "#e5e5ea",
    },
    filterTabActive: {
      backgroundColor: theme.colors?.primary || "#0078ff",
      borderColor: theme.colors?.primary || "#0078ff",
    },
    filterTabText: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.medium,
    },
    filterTabTextActive: {
      color: theme.colors?.text?.inverse || "#ffffff",
    },
    listContainer: {
      paddingHorizontal: 24,
    },
    historyItem: {
      flexDirection: "row",
      backgroundColor: theme.colors?.surface || "#ffffff",
      borderRadius: theme.borderRadius?.lg || 12,
      padding: 16,
      gap: 12,
      ...(theme.shadows?.sm || {}),
    },
    itemImage: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius?.md || 8,
      backgroundColor: theme.colors?.background || "#f9f9fb",
      alignItems: "center",
      justifyContent: "center",
    },
    itemContent: {
      flex: 1,
      gap: 6,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.semiBold,
      flex: 1,
      marginRight: 8,
    },
    itemStatus: {
      fontSize: theme.fontSizes?.xs || 12,
      ...theme.fontStyles.medium,
    },
    itemDetails: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    itemLocation: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
      flex: 1,
    },
    itemFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    itemDate: {
      fontSize: theme.fontSizes?.sm || 14,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
    },
    itemPrice: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.semiBold,
    },
    itemRating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      alignSelf: "flex-start",
    },
    ratingText: {
      fontSize: theme.fontSizes?.xs || 12,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.medium,
    },
    separator: {
      height: 16,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    emptyIcon: {
      marginBottom: 24,
      opacity: 0.6,
    },
    emptyTitle: {
      fontSize: theme.fontSizes?.h2 || 28,
      color: theme.colors?.text?.primary || "#000",
      ...theme.fontStyles.semiBold,
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.secondary || "#666",
      ...theme.fontStyles.regular,
      textAlign: "center",
      lineHeight:
        (theme.fontSizes?.base || 16) * (theme.lineHeights?.relaxed || 1.6),
    },
  });
