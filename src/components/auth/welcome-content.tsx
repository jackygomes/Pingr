import { StyleSheet, Text, View } from "react-native";

import { SlideToStart } from "@/components/slide-to-start";
import { Brand, Spacing } from "@/constants/theme";

export function WelcomeContent({
  onStart,
  onLogin,
}: {
  onStart: () => void;
  onLogin: () => void;
}) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Instant alerts for the people who matter</Text>
      <Text style={styles.subtitle}>
        Create private circles, set your own alerts and ping family and friends
        in seconds.
      </Text>

      <View style={styles.cta}>
        <SlideToStart
          label="Get Started"
          color={Brand.accent}
          knobColor={Brand.sheet}
          onComplete={onStart}
        />
      </View>

      <Text
        style={styles.login}
        onPress={onLogin}
        accessibilityRole="link"
        suppressHighlighting
      >
        Already have an account? <Text style={styles.loginLink}>Log in</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", gap: Spacing.three },
  title: {
    color: "#fff",
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    color: Brand.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 340,
  },
  cta: { alignSelf: "stretch", alignItems: "center", marginTop: Spacing.three },
  login: { color: Brand.muted, fontSize: 14 },
  loginLink: { color: "#fff", fontWeight: "600" },
});
