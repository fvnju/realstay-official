import { useTheme } from "@/hooks/useTheme";
import { locationAtom } from "@/utils/location";
import { Stack, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { Check, MagnifyingGlass, X } from "phosphor-react-native";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import MapView, {
  MapMarker,
  PROVIDER_DEFAULT,
  UrlTile,
} from "react-native-maps";
import Animated, {
  SlideInRight,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useListingForm } from "../create_listing/components";

const AnimatedMarker = Animated.createAnimatedComponent(MapMarker);

export default function MapFullView() {
  const router = useRouter();
  const {
    setLongitude,
    setLatitude,
    longitude: formLongitude,
    latitude: formLatitude,
  } = useListingForm();
  const [isPressed, setIsPressed] = useState(
    formLongitude !== undefined || formLatitude !== undefined
  );
  const { width, height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      width,
      height,
      alignItems: "center",
      justifyContent: "center",
    },
    map: {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
    },
    bottomPill: {
      position: "absolute",
      bottom: bottom + 24,
      left: width / 2,
      transform: [{ translateX: "-50%" }],
    },
    bottomPillText: {
      color: theme.colors.appTextPrimary,
      backgroundColor: theme.colors.appSurface,
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 24,
      ...theme.fontStyles.semiBold,
    },
    topBtnContainer: {
      position: "absolute",
      top: 24 + top,
      width: 48,
      height: 48,
      borderRadius: 999,
      backgroundColor: theme.colors.appSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    confirmBtnContainer: {
      position: "absolute",
      top: 24 + top + 48 + 24,
      width: 48,
      height: 48,
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    topAniView: { flex: 1, alignItems: "center", justifyContent: "center" },
  });

  const currentLocation = useAtomValue(locationAtom)!;

  const searchScales = useSharedValue(1);
  const closeScales = useSharedValue(1);
  const confirmScales = useSharedValue(1);
  const onPressIn = (btn: "search" | "close") => {
    if (btn === "search") {
      searchScales.value = withTiming(1.3, { duration: 100 });
    } else {
      closeScales.value = withTiming(1.3, { duration: 100 });
    }
  };
  const onPressOut = (btn: "search" | "close") => {
    if (btn === "search") {
      searchScales.value = withTiming(1, { duration: 100 });
    } else {
      closeScales.value = withTiming(1, { duration: 100 });
      setTimeout(() => {
        router.back();
      }, 80);
    }
  };

  const searchAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchScales.value }],
  }));
  const closeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScales.value }],
  }));
  const confirmAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: confirmScales.value }],
  }));

  const latitude = useSharedValue(formLatitude || currentLocation.latitude);
  const longitude = useSharedValue(formLongitude || currentLocation.longitude);

  // Animated props for the Marker
  const animatedProps = useAnimatedProps(() => ({
    coordinate: {
      latitude: latitude.value,
      longitude: longitude.value,
    },
  }));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.appBackground },
          animation: "slide_from_bottom",
        }}
      />

      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: formLatitude || currentLocation.latitude,
          longitude: formLongitude || currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={(e) => {
          setIsPressed(true);

          const { latitude: l, longitude: t } = e.nativeEvent.coordinate;

          latitude.value = withTiming(l, { duration: 200 });
          longitude.value = withTiming(t, { duration: 200 });
        }}
      >
        <UrlTile
          urlTemplate={`https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.png?key=${process.env.EXPO_PUBLIC_MAPTILE_KEY}`}
          maximumZ={19}
        />
        {isPressed && (
          <AnimatedMarker
            title="Selected Location"
            animatedProps={animatedProps}
            coordinate={{
              latitude: formLatitude || currentLocation.latitude,
              longitude: formLongitude || currentLocation.longitude,
            }}
          />
        )}
      </MapView>

      <Animated.View
        style={[styles.topBtnContainer, { left: 24 }, searchAnimStyle]}
      >
        <Pressable
          style={[styles.topAniView]}
          onPressIn={() => onPressIn("search")}
          onPressOut={() => onPressOut("search")}
        >
          <MagnifyingGlass
            color={theme.colors.appTextPrimary}
            size={20}
            weight="bold"
          />
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[styles.topBtnContainer, { right: 24 }, closeAnimStyle]}
      >
        <Pressable
          style={[styles.topAniView]}
          onPressIn={() => onPressIn("close")}
          onPressOut={() => onPressOut("close")}
        >
          <X color={theme.colors.appTextPrimary} size={20} weight="bold" />
        </Pressable>
      </Animated.View>

      {isPressed && (
        <Animated.View
          entering={SlideInRight}
          style={[styles.confirmBtnContainer, { right: 24 }, confirmAnimStyle]}
        >
          <Pressable
            style={[styles.topAniView]}
            onPressOut={() => {
              setLongitude(longitude.value);
              setLatitude(latitude.value);
              confirmScales.value = withTiming(1, { duration: 100 });
              setTimeout(() => {
                router.back();
              }, 80);
            }}
            onPressIn={() => {
              confirmScales.value = withTiming(1.3, { duration: 100 });
            }}
          >
            <Check
              color={theme.colors.appTextPrimary}
              size={20}
              weight="bold"
            />
          </Pressable>
        </Animated.View>
      )}

      <Animated.View style={styles.bottomPill}>
        <Text style={styles.bottomPillText}>Pin the exact location</Text>
      </Animated.View>
    </View>
  );
}
