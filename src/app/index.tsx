import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  LinearTransition,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { WelcomeContent } from "@/components/auth/welcome-content";
import { Radar } from "@/components/radar";
import { Brand, Spacing } from "@/constants/theme";

type Mode = "welcome" | "login" | "register";

/**
 * Welcome, Login and Register live on ONE screen. The gradient and radar stay
 * mounted; only the bottom sheet's content swaps, and `progress` (0 → 1) eases
 * the radar from crisp (welcome) to blurred behind the wordmark (auth).
 */
export default function AuthScreen() {
  const { height, width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>("welcome");
  const progress = useSharedValue(0);

  const radarSize = Math.min(Math.max(width * 1.05, 360), 480);
  const welcomeCenter = height * 0.3;
  const authHero = Math.max(height * 0.3, 230);
  const authCenter = (top + authHero) / 2;

  useEffect(() => {
    progress.value = withTiming(mode === "welcome" ? 0 : 1, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });
  }, [mode, progress]);

  // Android back returns to the welcome state instead of closing the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (mode === "welcome") return false;
      setMode("welcome");
      return true;
    });
    return () => sub.remove();
  }, [mode]);

  const radarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [0, authCenter - welcomeCenter],
        ),
      },
      { scale: interpolate(progress.value, [0, 1], [1, 0.85]) },
    ],
    // Plain blur of the radar itself: no tint/overlay layer on top.
    filter: [{ blur: progress.value * 8 }],
  }));
  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [16, 0]) }],
  }));
  const backStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#070910", "#1A0F1F", "#3A1620"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View
          style={[
            styles.radar,
            {
              top: welcomeCenter - radarSize / 2,
              width: radarSize,
              height: radarSize,
            },
            radarStyle,
          ]}
        >
          <Radar size={radarSize} />
        </Animated.View>
      </View>


      <Animated.View
        pointerEvents="none"
        style={[
          styles.wordmarkWrap,
          { top: top, height: authHero - top },
          wordmarkStyle,
        ]}
      >
        <Animated.Text style={styles.wordmark}>Pingr</Animated.Text>
        <Animated.Text style={styles.tagline}>
          Instant alerts for the people who matter
        </Animated.Text>
      </Animated.View>

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.kav}
        pointerEvents="box-none"
      >
        <Animated.View
          entering={SlideInDown.duration(600).easing(Easing.out(Easing.cubic))}
          layout={LinearTransition.duration(450)}
          style={[
            styles.sheet,
            {
              maxHeight: height - top - Spacing.six,
              paddingBottom: Math.max(bottom, Spacing.three) + Spacing.three,
            },
          ]}
        >
          <ScrollView
            style={styles.scroll}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              key={mode}
              entering={FadeIn.duration(250).delay(120)}
              exiting={FadeOut.duration(120)}
            >
              {mode === "welcome" && (
                <WelcomeContent
                  onStart={() => setMode("register")}
                  onLogin={() => setMode("login")}
                />
              )}
              {mode === "login" && (
                <LoginForm onSwitch={() => setMode("register")} />
              )}
              {mode === "register" && (
                <RegisterForm onSwitch={() => setMode("login")} />
              )}
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      <Animated.View
        pointerEvents={mode === "welcome" ? "none" : "auto"}
        style={[styles.back, { top: top + Spacing.two }, backStyle]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => setMode("welcome")}
          hitSlop={8}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg, overflow: "hidden" },
  radar: { position: "absolute", alignSelf: "center" },
  wordmarkWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
  },
  wordmark: {
    color: "#fff",
    fontSize: 52,
    lineHeight: 60,
    fontWeight: "700",
    letterSpacing: 1,
  },
  tagline: { color: "rgba(255,255,255,0.75)", fontSize: 14 },
  kav: { ...(StyleSheet.absoluteFill as object), justifyContent: "flex-end" },
  sheet: {
    backgroundColor: Brand.sheet,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  scroll: { flexGrow: 0 },
  back: { position: "absolute", left: Spacing.three },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
});
