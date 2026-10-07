import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth/auth-context';

/** Placeholder for the authenticated home ("My Circles"). */
export default function CirclesScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen>
      <View style={styles.body}>
        <ThemedText type="subtitle">Hi {user?.name} 👋</ThemedText>
        <ThemedText themeColor="textSecondary">Your circles will show up here.</ThemedText>
      </View>
      <Button title="Log out" variant="secondary" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', gap: Spacing.two },
});
