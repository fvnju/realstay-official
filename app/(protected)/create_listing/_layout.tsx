import { PrimaryButton } from "@/components/Button/Primary";
import { useTheme } from "@/hooks/useTheme";
import { getAuthToken, post } from "@/utils/apiClient";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";

import ENDPOINT from "@/constants/endpoint";
import { atom, useAtom, useAtomValue } from "jotai";
import { ArrowLeft, CheckCircle, X } from "phosphor-react-native";
import { Fragment, memo, useCallback, useEffect, useRef } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  FadeIn,
  FadeOut,
  interpolate,
  SequencedTransition,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { $listingSubmision, initValues } from ".";
import { useListingForm } from "./components";
import { listingAddressAtom } from "./store";

export default () => {
  const theme = useTheme();
  const MemLayout = memo(Layout);

  return (
    <Fragment>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          contentStyle: {
            backgroundColor: theme.colors.appBackground,
          },
        }}
      />
      <Layout />
    </Fragment>
  );
};

export const createListingStepAtom = atom<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
export const isPublishingAtom = atom(false);
export const isPublishedAtom = atom(false);

const PROGRESS_WIDTH = 140;
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

function Layout() {
  const { resetForm, ...listingForm } = useListingForm();
  const address = useAtomValue(listingAddressAtom);
  const router = useRouter();
  const imageURls = useRef<string[]>([]);

  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const [createListingStep, setCreatelistingStep] = useAtom(
    createListingStepAtom
  );
  const [isPublishing, setIsPublishing] = useAtom(isPublishingAtom);
  const [isPublished, setIsPublished] = useAtom(isPublishedAtom);

  useEffect(() => {
    if (createListingStep === 7 && imageURls.current.length === 0) {
      uploadImages();
    }
  }, [createListingStep, imageURls]);

  const uploadImages = async () => {
    try {
      const token = await getAuthToken();

      // Process all images and add them to FormData (React Native way)
      for (const img of $listingSubmision.get().photos) {
        const formData = new FormData();
        const imageUri = img.uri;
        const fileName = img.fileName ?? imageUri.split("/").pop() ?? "unknown";
        const fileType = fileName.includes(".")
          ? `image/${fileName.split(".").pop()}`
          : "image/jpeg";

        // React Native FormData expects this format
        formData.append("file", {
          uri: imageUri,
          name: fileName,
          type: fileType,
        } as any);

        // Upload with authentication
        const response = await fetch(ENDPOINT + "/utility/file-upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          imageURls.current.push(result.data.url);
        } else {
          const errorText = await response.text();
          toast.error("Upload failed:", { description: errorText });
        }
      }
    } catch (e) {
      if (e instanceof Error)
        toast.error("Error uploading images:", { description: e.message });
    }
  };

  const createListing = async () => {
    const listingForm = $listingSubmision.get();
    try {
      const data = {
        place_holder_address: listingForm.address,
        google_formatted_address: "n/a",
        state: listingForm.state,
        lga: "n/a",
        lat: Number(listingForm.latitude),
        lng: Number(listingForm.longitude),
        type: listingForm.propertyType,
        no_of_beds: Number(listingForm.beds) || 0,
        are_pets_allowed: Boolean(listingForm.petsAllowed),
        no_of_bedrooms: Number(listingForm.bedrooms) || 0,
        no_of_bathrooms: Number(listingForm.bathrooms) || 0,
        are_parties_allowed: Boolean(listingForm.partiesAllowed),
        extra_offerings: listingForm.amenities,
        title: listingForm.title,
        description: listingForm.description,
        cost: Number(listingForm.price),
        cost_cycle: listingForm.paymentCycle,
        photos: imageURls.current,
      };

      console.log("Sending listing data:", data);

      // Use the apiClient instead of raw fetch
      const response = await post("/listing/create", data, {
        requiresAuth: true,
        showErrorToast: false, // We'll handle errors manually
      });

      console.log("API Response:", response);

      if (response.data && response.status >= 200 && response.status < 300) {
        return true;
      } else {
        toast.error("Error submitting listing:", {
          description: response.error || "Unknown error occurred",
        });
        return false;
      }
    } catch (e) {
      console.error("Create listing error:", e);
      if (e instanceof Error) {
        toast.error("Error uploading listing:", { description: e.message });
      }
      return false;
    }
  };

  // Enhanced animation values
  const progress = useSharedValue(PROGRESS_WIDTH / 4);
  const headerOpacity = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const exitButtonRotation = useSharedValue(0);
  const successScale = useSharedValue(0);

  // Sync progress with step changes
  useEffect(() => {
    progress.value = withSpring(
      (PROGRESS_WIDTH / 7) * createListingStep,
      SPRING_CONFIG
    );
  }, [createListingStep]);

  const progressStyle = useAnimatedStyle(() => {
    const progressPercent = interpolate(
      progress.value,
      [0, PROGRESS_WIDTH],
      [0, 100],
      Extrapolate.CLAMP
    );

    return {
      width: progress.value,
      opacity: interpolate(
        progressPercent,
        [0, 25],
        [0.3, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: interpolate(headerOpacity.value, [0, 1], [0.95, 1]) }],
  }));

  const exitButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${exitButtonRotation.value}deg` },
      { scale: buttonScale.value },
    ],
  }));

  const successAnimatedStyle = useAnimatedStyle(() => ({
    opacity: successScale.value,
    transform: [{ scale: successScale.value }],
  }));

  const nextActions = new Map([
    [
      1,
      () => {
        headerOpacity.value = withTiming(0.7, { duration: 200 });
        setTimeout(() => {
          router.push("/create_listing/part2");
          setCreatelistingStep(2);
          headerOpacity.value = withSpring(1, SPRING_CONFIG);
        }, 100);
      },
    ] as const,
    [
      2,
      () => {
        headerOpacity.value = withTiming(0.7, { duration: 200 });
        setTimeout(() => {
          router.push("/create_listing/part3");
          setCreatelistingStep(3);
          headerOpacity.value = withSpring(1, SPRING_CONFIG);
        }, 100);
      },
    ] as const,
    [
      3,
      () => {
        headerOpacity.value = withTiming(0.7, { duration: 200 });
        setTimeout(() => {
          router.push("/create_listing/part4");
          setCreatelistingStep(4);
          headerOpacity.value = withSpring(1, SPRING_CONFIG);
        }, 100);
      },
    ] as const,
    [
      4,
      () => {
        headerOpacity.value = withTiming(0.7, { duration: 200 });
        setTimeout(() => {
          router.push("/create_listing/part5");
          setCreatelistingStep(5);
          headerOpacity.value = withSpring(1, SPRING_CONFIG);
        }, 100);
      },
    ] as const,
    [
      5,
      () => {
        headerOpacity.value = withTiming(0.7, { duration: 200 });
        setTimeout(() => {
          router.push("/create_listing/part6");
          setCreatelistingStep(6);
          headerOpacity.value = withSpring(1, SPRING_CONFIG);
        }, 100);
      },
    ] as const,
    [
      6,
      () => {
        headerOpacity.value = withTiming(0.7, { duration: 200 });
        setTimeout(() => {
          router.push("/create_listing/publish");
          setCreatelistingStep(7);
          headerOpacity.value = withSpring(1, SPRING_CONFIG);
        }, 100);
      },
    ] as const,
    [
      7,
      () => {
        handlePublish();
      },
    ],
  ] as const);

  const nextFunc = () => {
    // Haptic feedback for better UX
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    buttonScale.value = withSpring(0.95, { duration: 100 }, () => {
      buttonScale.value = withSpring(1, SPRING_CONFIG);
    });

    const fn = nextActions.get(createListingStep)!;
    fn();
  };

  const handlePrevious = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    headerOpacity.value = withTiming(0.7, { duration: 200 });

    const prevStep = (createListingStep - 1) as 1 | 2 | 3 | 4 | 5 | 6;
    const routes = {
      1: "/create_listing",
      2: "/create_listing/part2",
      3: "/create_listing/part3",
      4: "/create_listing/part4",
      5: "/create_listing/part5",
      6: "/create_listing/part6",
    } as const;

    setTimeout(() => {
      router.push(routes[prevStep]);
      setCreatelistingStep(prevStep);
      headerOpacity.value = withSpring(1, SPRING_CONFIG);
    }, 100);
  }, [createListingStep]);

  const handlePublish = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsPublishing(true);

    const success = await createListing();

    setIsPublishing(false);
    if (success) {
      setIsPublished(true);

      // Success animation
      successScale.value = withSequence(
        withSpring(1.1, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      );

      $listingSubmision.set(initValues);

      // Auto-navigate after success
      setTimeout(() => {
        router.replace("/agents");
        setCreatelistingStep(1);
        setIsPublished(false);
        successScale.value = 0;
      }, 2500);
    } else {
    }
  }, []);

  const handleExit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();

    // Animate exit button rotation
    exitButtonRotation.value = withSpring(180, SPRING_CONFIG);
    headerOpacity.value = withTiming(0, { duration: 400 });

    resetForm();

    setTimeout(() => {
      router.dismissTo("/agents");
      setCreatelistingStep(1);
      setIsPublishing(false);
      setIsPublished(false);
      exitButtonRotation.value = 0;
      headerOpacity.value = withSpring(1, SPRING_CONFIG);
      successScale.value = 0;
    }, 300);
  }, []);

  return (
    <Fragment>
      {isPublished && (
        <View
          style={[
            {
              width: width,
              height: height + 40,
              backgroundColor: theme.colors.appBackground,
              position: "absolute",
              zIndex: 100,
            },
            styles.successContainer,
          ]}
        >
          <Animated.View style={[styles.successContent, successAnimatedStyle]}>
            <View
              style={[
                styles.successIconContainer,
                {
                  backgroundColor:
                    theme.colors.status?.success + "20" || "#10B981" + "20",
                },
              ]}
            >
              <CheckCircle
                color={theme.colors.status?.success || "#10B981"}
                size={64}
                weight="fill"
              />
            </View>
            <Text
              style={[
                styles.successTitle,
                { color: theme.colors.appTextPrimary },
                theme.fontStyles.bold,
              ]}
            >
              Listing Published!
            </Text>
            <Text
              style={[
                styles.successSubtitle,
                { color: theme.colors.appTextSecondary },
              ]}
            >
              Your property is now live and ready to receive bookings
            </Text>
          </Animated.View>
        </View>
      )}
      <View style={{ flex: 1, backgroundColor: theme.colors.appBackground }}>
        <Animated.View
          style={[
            {
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingTop: top + 32,
              paddingBottom: 12,
            },
            headerStyle,
          ]}
        >
          <Animated.View style={exitButtonStyle}>
            <TouchableOpacity
              style={[
                styles.exitButton,
                {
                  backgroundColor: theme.colors.appSurface,
                  shadowColor: theme.colors.appDropShadow,
                },
              ]}
              onPress={handleExit}
              activeOpacity={0.7}
            >
              <X
                color={theme.colors.appTextSecondary}
                size={20}
                weight="bold"
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={styles.headerCenter}
            entering={FadeIn.delay(200)}
          >
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: theme.colors.elementsTextFieldBorder,
                    width: PROGRESS_WIDTH,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressFill,
                    { backgroundColor: theme.colors.appPrimary },
                    progressStyle,
                  ]}
                />
              </View>
              <Animated.Text
                style={[
                  styles.progressText,
                  { color: theme.colors.appTextSecondary },
                ]}
                key={createListingStep}
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
              >
                Step {createListingStep} of 7
              </Animated.Text>
            </View>
          </Animated.View>

          <View style={{ width: 40 }} />
        </Animated.View>

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.colors.appBackground,
              flex: 1,
            },
          }}
        />
        <View
          style={{
            marginBottom: bottom,
            paddingBottom: 12,
            paddingHorizontal: 20,
            paddingTop: 12,
            flexDirection: "row",
            gap: 16,
          }}
        >
          {createListingStep > 1 && (
            <Animated.View
              style={{ flex: 1 }}
              entering={SlideInRight.duration(300).springify()}
              exiting={SlideOutLeft.duration(200)}
              layout={SequencedTransition.duration(300)}
            >
              <TouchableOpacity
                style={[
                  styles.prevButton,
                  {
                    backgroundColor: theme.colors.appSurface,
                    borderColor: theme.colors.elementsTextFieldBorder,
                  },
                ]}
                onPress={handlePrevious}
                activeOpacity={0.8}
              >
                <ArrowLeft
                  color={theme.colors.appTextPrimary}
                  size={18}
                  weight="regular"
                />
                <Text
                  style={[
                    { color: theme.colors.appTextPrimary },
                    theme.fontStyles.medium,
                  ]}
                >
                  Previous
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          <Animated.View
            style={{ flex: 1 }}
            layout={SequencedTransition.duration(300)}
          >
            <PrimaryButton
              onPress={nextFunc}
              disabled={isPublishing}
              style={[
                createListingStep === 7 && {
                  backgroundColor: isPublishing
                    ? theme.colors.elementsButtonDisabled
                    : theme.colors.appPrimary,
                },
              ]}
            >
              {createListingStep === 7 ? (
                isPublishing ? (
                  <Text style={[{ color: "#fff" }, theme.fontStyles.semiBold]}>
                    Publishing...
                  </Text>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={[{ color: "#fff" }, theme.fontStyles.semiBold]}
                    >
                      Publish Listing
                    </Text>
                  </View>
                )
              ) : createListingStep > 1 ? (
                "Continue"
              ) : (
                "Get Started"
              )}
            </PrimaryButton>
          </Animated.View>
        </View>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  exitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 10,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  progressContainer: {
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  prevButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    gap: 8,
  },
  // Success screen styles
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  successContent: {
    alignItems: "center",
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    opacity: 0.8,
  },
});
