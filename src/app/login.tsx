import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AuthField } from '@/components/auth/auth-field';
import { Checkbox, FooterLink, SocialSignIn } from '@/components/auth/auth-extras';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/button';
import { Brand, Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth/auth-context';
import { validateEmail } from '@/lib/auth/validation';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string>();

  const emailError = submitted ? validateEmail(email) : undefined;
  const passwordError = submitted && !password ? 'Enter your password' : undefined;

  async function onSubmit() {
    setSubmitted(true);
    setFormError(undefined);
    if (validateEmail(email) || !password) return;

    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not log in. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Sign in to your account">
      <AuthField
        icon="mail-outline"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <AuthField
        icon="lock-closed-outline"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        onSubmitEditing={onSubmit}
      />

      <View style={styles.row}>
        <Checkbox checked={remember} onToggle={() => setRemember((r) => !r)}>
          Remember me
        </Checkbox>
        <Text
          accessibilityRole="link"
          style={styles.forgot}
          onPress={() => Alert.alert('Coming soon', 'Password reset will be added with Firebase.')}>
          Forgot password?
        </Text>
      </View>

      {formError ? <Text style={styles.formError}>{formError}</Text> : null}
      <Button title="Sign in" onPress={onSubmit} loading={loading} style={styles.cta} />

      <SocialSignIn verb="sign in" />
      <FooterLink text="Don't have an account?" action="Sign up" onPress={() => router.replace('/register')} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgot: { color: Brand.accent, fontSize: 14, fontWeight: '600' },
  formError: { color: Brand.danger, fontSize: 13, textAlign: 'center' },
  cta: { backgroundColor: Brand.accent, marginTop: Spacing.one },
});
