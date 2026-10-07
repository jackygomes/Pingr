import { Ionicons } from '@expo/vector-icons';
import { BlurTargetView, BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radar } from '@/components/radar';
import { Brand, Spacing } from '@/constants/theme';

/**
 * Shared layout for Login / Register: a blurred radar + "Pingr" wordmark on top,
 * with the form sheet sliding up from the bottom.
 */
export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  const { height, width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const targetRef = useRef<View | null>(null);

  const heroHeight = Math.round(Math.max(height * 0.34, 240));
  const radarSize = Math.min(Math.max(width * 1.1, 360), 520);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#070910', '#1A0F1F', '#3A1620']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Radar, blurred behind the wordmark */}
      <BlurTargetView ref={targetRef} style={[styles.heroLayer, { height: heroHeight + Spacing.five }]}>
        <View style={{ marginTop: (heroHeight - radarSize) / 2 }}>
          <Radar size={radarSize} />
        </View>
      </BlurTargetView>
      <BlurView
        blurTarget={targetRef}
        blurMethod="dimezisBlurViewSdk31Plus"
        tint="dark"
        intensity={45}
        style={[styles.heroLayer, { height: heroHeight + Spacing.five }]}
      />

      <Animated.View
        entering={FadeIn.duration(500)}
        style={[styles.heroLayer, styles.wordmarkWrap, { height: heroHeight }]}
        pointerEvents="none">
        <Animated.Text entering={FadeInDown.delay(150).duration(600)} style={styles.wordmark}>
          Pingr
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(300).duration(600)} style={styles.tagline}>
          Instant alerts for the people who matter
        </Animated.Text>
      </Animated.View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={{ height: heroHeight }} />
          <Animated.View
            entering={SlideInDown.duration(550).easing(Easing.out(Easing.cubic))}
            style={[styles.sheet, { paddingBottom: Math.max(bottom, Spacing.three) + Spacing.three }]}>
            <Text style={styles.title}>{title}</Text>
            {children}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={goBack}
        hitSlop={8}
        style={[styles.back, { top: top + Spacing.two }]}>
        <Ionicons name="chevron-back" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  heroLayer: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden', alignItems: 'center' },
  wordmarkWrap: { justifyContent: 'center', gap: Spacing.one },
  wordmark: { color: '#fff', fontSize: 52, lineHeight: 60, fontWeight: '700', letterSpacing: 1 },
  tagline: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  sheet: {
    flexGrow: 1,
    backgroundColor: Brand.sheet,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  title: { color: Brand.text, fontSize: 24, lineHeight: 32, fontWeight: '600', textAlign: 'center', marginBottom: Spacing.one },
  back: {
    position: 'absolute',
    left: Spacing.three,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
