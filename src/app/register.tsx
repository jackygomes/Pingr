import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AuthField } from '@/components/auth/auth-field';
import { Checkbox, FooterLink, SocialSignIn } from '@/components/auth/auth-extras';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/button';
import { Brand, Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth/auth-context';
import { validateEmail, validateName, validatePassword } from '@/lib/auth/validation';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string>();

  const nameError = submitted ? validateName(name) : undefined;
  const emailError = submitted ? validateEmail(email) : undefined;
  const passwordError = submitted ? validatePassword(password) : undefined;
  const confirmError = submitted && confirm !== password ? 'Passwords do not match' : undefined;
  const termsError = submitted && !agreed ? 'Please accept the terms to continue' : undefined;

  async function onSubmit() {
    setSubmitted(true);
    setFormError(undefined);
    if (
      validateName(name) ||
      validateEmail(email) ||
      validatePassword(password) ||
      confirm !== password ||
      !agreed
    )
      return;

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
    <AuthShell title="Create an account">
      <AuthField
        icon="person-outline"
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        error={nameError}
        autoComplete="name"
        textContentType="name"
      />
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <AuthField
        icon="lock-closed-outline"
        placeholder="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        error={confirmError}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={onSubmit}
      />

      <Checkbox checked={agreed} onToggle={() => setAgreed((a) => !a)}>
        I agree to the <Text style={styles.link}>Terms & Conditions</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Checkbox>
      {termsError ? <Text style={styles.formError}>{termsError}</Text> : null}

      {formError ? <Text style={styles.formError}>{formError}</Text> : null}
      <Button title="Sign up" onPress={onSubmit} loading={loading} style={styles.cta} />

      <SocialSignIn verb="sign up" />
      <FooterLink text="Already have an account?" action="Sign in" onPress={() => router.replace('/login')} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  link: { color: Brand.accent, fontWeight: '600' },
  formError: { color: Brand.danger, fontSize: 13, textAlign: 'center' },
  cta: { backgroundColor: Brand.accent, marginTop: Spacing.one },
});
