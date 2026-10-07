import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

const ACCENT = "#FF5A4F";
const SWEEP_MS = 4000;
const PULSE_MS = 3200;
const WEDGE_DEG = 75;

function Pulse({ size, delay }: { size: number; delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: PULSE_MS, easing: Easing.out(Easing.quad) }),
        -1,
      ),
    );
  }, [t, delay]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.45 * (1 - t.value),
    transform: [{ scale: 0.15 + 0.85 * t.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.abs,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: ACCENT,
          borderWidth: 2,
        },
        style,
      ]}
    />
  );
}

function Blip({
  x,
  y,
  delay,
  size,
}: {
  x: number;
  y: number;
  delay: number;
  size: number;
}) {
  const o = useSharedValue(0.15);
  useEffect(() => {
    o.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.15, { duration: SWEEP_MS - 300 }),
        ),
        -1,
      ),
    );
  }, [o, delay]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));

  return (
    <Animated.View
      style={[
        styles.blip,
        {
          left: size / 2 + x * (size / 2) - 5,
          top: size / 2 + y * (size / 2) - 5,
        },
        style,
      ]}
    />
  );
}

/** Animated radar: static rings, expanding pulses, a rotating sweep and blinking blips. */
export function Radar({ size }: { size: number }) {
  const c = size / 2;
  const rad = (WEDGE_DEG * Math.PI) / 180;
  const wedge = `M ${c} ${c} L ${c} 0 A ${c} ${c} 0 0 0 ${c - c * Math.sin(rad)} ${c - c * Math.cos(rad)} Z`;

  const angle = useSharedValue(0);
  useEffect(() => {
    angle.value = withRepeat(
      withTiming(360, { duration: SWEEP_MS, easing: Easing.linear }),
      -1,
    );
  }, [angle]);
  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value}deg` }],
  }));

  // Blips sit where the sweep passes them: delay = angle of blip / 360 * period.
  const blips = [
    { x: 0.45, y: -0.3 },
    { x: -0.55, y: 0.25 },
    { x: 0.2, y: 0.6 },
  ].map((b) => {
    const deg = ((Math.atan2(b.x, -b.y) * 180) / Math.PI + 360) % 360;
    return { ...b, delay: (deg / 360) * SWEEP_MS };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={styles.abs}>
        {[0.98, 0.78, 0.56, 0.34].map((r, i) => (
          <Circle
            key={r}
            cx={c}
            cy={c}
            r={c * r}
            fill={i === 3 ? "rgba(255,90,79,0.08)" : "none"}
            stroke="rgba(255,255,255,0.16)"
            strokeWidth={1}
            strokeDasharray={i === 0 ? "4 6" : undefined}
          />
        ))}
      </Svg>

      {/* <Pulse size={size * 0.9} delay={0} />
      <Pulse size={size * 0.9} delay={PULSE_MS / 2} /> */}

      <Animated.View
        style={[styles.abs, { width: size, height: size }, sweepStyle]}
      >
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient
              id="sweep"
              x1={c - c * Math.sin(rad)}
              y1="0"
              x2={c}
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor={ACCENT} stopOpacity="0" />
              <Stop offset="1" stopColor={ACCENT} stopOpacity="0.5" />
            </LinearGradient>
          </Defs>
          <Path d={wedge} fill="url(#sweep)" />
          <Path
            d={`M ${c} ${c} L ${c} 0`}
            stroke={ACCENT}
            strokeWidth={2}
            opacity={0.9}
          />
        </Svg>
      </Animated.View>

      {blips.map((b, i) => (
        <Blip key={i} {...b} size={size} />
      ))}

      <View style={[styles.abs, styles.center, { width: size, height: size }]}>
        <View style={styles.core}>
          <Ionicons name="notifications" size={34} color="#FF8A80" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  abs: { position: "absolute" },
  center: { alignItems: "center", justifyContent: "center" },
  blip: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFD2CE",
  },
  core: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,90,79,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,90,79,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});
