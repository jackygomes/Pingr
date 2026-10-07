import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const KNOB = 54;
const PAD = 5;
const COMPLETE_AT = 0.8;

type Props = {
  label: string;
  onComplete: () => void;
  color: string;
  knobColor: string;
};

/** "Slide to continue" pill: drag the knob past 80% to trigger `onComplete`. */
export function SlideToStart({ label, onComplete, color, knobColor }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const maxX = Math.max(trackWidth - KNOB - PAD * 2, 1);
  const x = useSharedValue(0);
  const startX = useSharedValue(0);

  const complete = () => {
    onComplete();
    // Return the knob once the next screen is up, so coming back works.
    x.value = withDelay(600, withTiming(0, { duration: 250 }));
  };

  const pan = Gesture.Pan()
    .enabled(trackWidth > 0)
    .onBegin(() => {
      startX.value = x.value;
    })
    .onUpdate((e) => {
      x.value = Math.min(Math.max(startX.value + e.translationX, 0), maxX);
    })
    .onEnd(() => {
      if (x.value >= maxX * COMPLETE_AT) {
        x.value = withTiming(maxX, { duration: 120 });
        scheduleOnRN(complete);
      } else {
        x.value = withSpring(0, { damping: 18, stiffness: 220 });
      }
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));
  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      x.value,
      [0, maxX * 0.85],
      [1, 0.4],
      Extrapolation.CLAMP,
    ),
  }));
  const fillStyle = useAnimatedStyle(() => ({
    width: x.value + KNOB + PAD,
    // Hidden at rest; revealed as soon as the knob starts moving.
    opacity: interpolate(x.value, [0, 6], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Slide to continue"
      accessibilityActions={[{ name: "activate" }]}
      onAccessibilityAction={onComplete}
      onLayout={(e: LayoutChangeEvent) =>
        setTrackWidth(e.nativeEvent.layout.width)
      }
      style={[styles.track, { backgroundColor: color }]}
    >
      <Animated.View style={[styles.fill, fillStyle]} />
      <Animated.View pointerEvents="none" style={[styles.labelWrap, labelStyle]}>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.knob, { backgroundColor: knobColor }, knobStyle]}
        >
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    alignSelf: "stretch",
    maxWidth: 480,
    width: "100%",
    height: KNOB + PAD * 2,
    borderRadius: (KNOB + PAD * 2) / 2,
    padding: PAD,
    justifyContent: "center",
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: (KNOB + PAD * 2) / 2,
    // Darker shade of the track colour, so the slid part stays on-brand.
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  // Spans the whole track so the label is centred regardless of the knob.
  labelWrap: {
    ...StyleSheet.absoluteFill as object,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
