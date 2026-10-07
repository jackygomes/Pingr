import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radar } from '@/components/radar';
import { SlideToStart } from '@/components/slide-to-start';
import { Spacing } from '@/constants/theme';

// The welcome screen is always dark, regardless of system theme.
const ACCENT = '#FF5A4F';
const SHEET = '#11141D';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const radarSize = Math.min(width * 1.05, 480);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#070910', '#1A0F1F', '#3A1620']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

      <View style={[styles.hero, { paddingTop: top }]}>
        <Radar size={radarSize} />
      </View>

      <View style={[styles.sheet, { paddingBottom: Math.max(bottom, Spacing.three) + Spacing.three }]}>
        <Text style={styles.title}>Instant alerts for the people who matter</Text>
        <Text style={styles.subtitle}>
          Create private circles, set your own alerts, and ping family and friends in seconds.
        </Text>

        <View style={styles.cta}>
          <SlideToStart label="Get Started" color={ACCENT} knobColor={SHEET} onComplete={() => router.push('/register')} />
        </View>

        <Pressable accessibilityRole="link" onPress={() => router.push('/login')} hitSlop={8}>
          <Text style={styles.login}>
            Already have an account? <Text style={styles.loginLink}>Log in</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070910' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sheet: {
    backgroundColor: SHEET,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Spacing.five,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  title: { color: '#fff', fontSize: 26, lineHeight: 34, fontWeight: '600', textAlign: 'center' },
  subtitle: { color: '#A3A8B5', fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 340 },
  cta: { alignSelf: 'stretch', alignItems: 'center', marginTop: Spacing.three },
  login: { color: '#A3A8B5', fontSize: 14 },
  loginLink: { color: '#fff', fontWeight: '600' },
});
