import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppState, Linking, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  defaultStoreUrl,
  fetchVersionPolicy,
  getUpdateStatus,
  installedVersion,
  type VersionPolicy,
} from './version-policy';

/** Re-checks whenever the app returns to the foreground. */
function useOnForeground(callback: () => void) {
  useEffect(() => {
    callback();
    const sub = AppState.addEventListener('change', (s) => s === 'active' && callback());
    return () => sub.remove();
  }, [callback]);
}

/** Native-binary updates: reads the remote policy and decides ok / optional / required. */
function useVersionPolicy() {
  const [policy, setPolicy] = useState<VersionPolicy | null>(null);
  const refresh = useCallback(async () => setPolicy(await fetchVersionPolicy()), []);
  useOnForeground(refresh);
  return { policy, status: getUpdateStatus(installedVersion, policy) };
}

/** JS-bundle updates (EAS Update): downloads in the background, then offers a restart. */
function useOtaUpdate() {
  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();

  const check = useCallback(async () => {
    if (!Updates.isEnabled) return; // dev builds / Expo Go
    try {
      await Updates.checkForUpdateAsync();
    } catch {
      // offline or server error — try again next time
    }
  }, []);
  useOnForeground(check);

  useEffect(() => {
    if (isUpdateAvailable && !isUpdatePending) Updates.fetchUpdateAsync().catch(() => {});
  }, [isUpdateAvailable, isUpdatePending]);

  return { ready: isUpdatePending, restart: () => Updates.reloadAsync() };
}

function openStore(policy: VersionPolicy | null) {
  Linking.openURL(policy?.storeUrl ?? defaultStoreUrl()).catch(() => {});
}

function Banner({ text, action, onPress }: { text: string; action: string; onPress: () => void }) {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.banner, { backgroundColor: theme.backgroundSelected, paddingTop: top + Spacing.two }]}>
      <ThemedText type="small" style={styles.bannerText}>
        {text}
      </ThemedText>
      <ThemedText type="linkPrimary" onPress={onPress} accessibilityRole="button">
        {action}
      </ThemedText>
    </View>
  );
}

export function UpdateGate({ children }: { children: ReactNode }) {
  const { policy, status } = useVersionPolicy();
  const ota = useOtaUpdate();
  const theme = useTheme();

  if (status === 'required') {
    return (
      <Screen>
        <View style={styles.blocker}>
          <Ionicons name="arrow-up-circle" size={72} color={theme.primary} />
          <ThemedText type="subtitle" style={styles.center}>
            Update required
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.center}>
            {policy?.message ?? 'This version of Pingr is no longer supported. Please update to continue.'}
          </ThemedText>
        </View>
        <Button title="Update now" onPress={() => openStore(policy)} />
      </Screen>
    );
  }

  return (
    <View style={styles.flex}>
      {ota.ready ? (
        <Banner text="A new version is ready." action="Restart" onPress={ota.restart} />
      ) : status === 'optional' ? (
        <Banner text="A new version of Pingr is available." action="Update" onPress={() => openStore(policy)} />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  blocker: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  center: { textAlign: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  bannerText: { flex: 1 },
});
