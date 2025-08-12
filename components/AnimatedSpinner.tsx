import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const spinnerStyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  spinner: {
    width: 40,
    height: 40,
    position: "relative",
  },
  dot1: {
    position: "absolute",
    top: 0,
    left: 18,
    width: 4,
    height: 4,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  dot2: {
    position: "absolute",
    top: 18,
    right: 0,
    width: 4,
    height: 4,
    backgroundColor: "#007AFF",
    borderRadius: 2,
    opacity: 0.75,
  },
  dot3: {
    position: "absolute",
    bottom: 0,
    left: 18,
    width: 4,
    height: 4,
    backgroundColor: "#007AFF",
    borderRadius: 2,
    opacity: 0.5,
  },
  dot4: {
    position: "absolute",
    top: 18,
    left: 0,
    width: 4,
    height: 4,
    backgroundColor: "#007AFF",
    borderRadius: 2,
    opacity: 0.25,
  },
});

export function AnimatedSpinner() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={spinnerStyles.container}>
      <Animated.View style={[spinnerStyles.spinner, animatedStyle]}>
        <View style={spinnerStyles.dot1} />
        <View style={spinnerStyles.dot2} />
        <View style={spinnerStyles.dot3} />
        <View style={spinnerStyles.dot4} />
      </Animated.View>
    </View>
  );
}
