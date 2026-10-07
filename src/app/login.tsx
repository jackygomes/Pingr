import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth/auth-context';
import { validateEmail } from '@/lib/auth/validation';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <Screen>
      <ThemedText type="subtitle">Welcome back</ThemedText>

      <View style={styles.form}>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={emailError}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={passwordError}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          onSubmitEditing={onSubmit}
        />
        {formError ? (
          <ThemedText type="small" themeColor="danger">
            {formError}
          </ThemedText>
        ) : null}
        <Button title="Log in" onPress={onSubmit} loading={loading} />
      </View>

      <View style={styles.footer}>
        <ThemedText type="small" themeColor="textSecondary">
          New to Pingr?
        </ThemedText>
        <Link href="/register" replace>
          <ThemedText type="linkPrimary">Create account</ThemedText>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.three, marginTop: Spacing.three },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.one, alignItems: 'center' },
});
