import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';

export function Checkbox({ checked, onToggle, children }: { checked: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={styles.check}>
      <Ionicons
        name={checked ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={checked ? Brand.accent : Brand.muted}
      />
      <Text style={styles.checkText}>{children}</Text>
    </Pressable>
  );
}

/** "Or sign in with" + Google button. Google sign-in lands with Firebase. */
export function SocialSignIn({ verb }: { verb: 'sign in' | 'sign up' }) {
  return (
    <View style={styles.social}>
      <Text style={styles.muted}>Or {verb} with</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
        onPress={() => Alert.alert('Coming soon', 'Google sign-in will be added with Firebase.')}
        style={({ pressed }) => [styles.google, pressed && { opacity: 0.8 }]}>
        <Ionicons name="logo-google" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

export function FooterLink({ text, action, onPress }: { text: string; action: string; onPress: () => void }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.muted}>
        {text}{' '}
        <Text style={styles.link} onPress={onPress} accessibilityRole="link">
          {action}
        </Text>
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  check: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  checkText: { color: Brand.muted, fontSize: 14, flexShrink: 1 },
  social: { alignItems: 'center', gap: Spacing.three, marginTop: Spacing.two },
  muted: { color: Brand.muted, fontSize: 14, textAlign: 'center' },
  google: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Brand.field,
    borderWidth: 1.5,
    borderColor: Brand.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Brand.border,
    paddingTop: Spacing.three,
    marginTop: Spacing.two,
    alignItems: 'center',
  },
  link: { color: Brand.accent, fontWeight: '600' },
});
