import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth/auth-context';
import { validateEmail, validateName, validatePassword } from '@/lib/auth/validation';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string>();

  const nameError = submitted ? validateName(name) : undefined;
  const emailError = submitted ? validateEmail(email) : undefined;
  const passwordError = submitted ? validatePassword(password) : undefined;

  async function onSubmit() {
    setSubmitted(true);
    setFormError(undefined);
    if (validateName(name) || validateEmail(email) || validatePassword(password)) return;

    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not create account. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ThemedText type="subtitle">Create your account</ThemedText>

      <View style={styles.form}>
        <TextField
          label="Name"
          value={name}
          onChangeText={setName}
          error={nameError}
          autoComplete="name"
          textContentType="name"
        />
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
          autoComplete="new-password"
          textContentType="newPassword"
          onSubmitEditing={onSubmit}
        />
        {formError ? (
          <ThemedText type="small" themeColor="danger">
            {formError}
          </ThemedText>
        ) : null}
        <Button title="Create account" onPress={onSubmit} loading={loading} />
      </View>

      <View style={styles.footer}>
        <ThemedText type="small" themeColor="textSecondary">
          Already have an account?
        </ThemedText>
        <Link href="/login" replace>
          <ThemedText type="linkPrimary">Log in</ThemedText>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.three, marginTop: Spacing.three },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.one, alignItems: 'center' },
});
