import React from "react";
import { ColorValue, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressCircleProps {
  progress: SharedValue<number>;
  radius?: number;
  backgroundCircleColor?: ColorValue;
  movingCircleColor?: ColorValue | SharedValue<ColorValue | undefined>;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  radius = 16,
  backgroundCircleColor = "#e6e6e6",
  movingCircleColor = "#00B87C",
}) => {
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={styles.container}>
      <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
        {/* Background Circle */}
        <Circle
          stroke={backgroundCircleColor}
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fillOpacity={0}
        />
        {/* Foreground Progress Circle */}
        <AnimatedCircle
          stroke={movingCircleColor}
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          originX={radius + strokeWidth / 2}
          originY={radius + strokeWidth / 2}
          fillOpacity={0}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProgressCircle;
