import * as Application from 'expo-application';

/**
 * Remote JSON describing which native app versions are allowed, e.g.
 * { "minimumVersion": "1.2.0", "latestVersion": "1.4.0", "message": "..." }
 *
 * - below `minimumVersion` → blocking "update required" screen (force update)
 * - below `latestVersion`  → dismissible "update available" banner
 */
export type VersionPolicy = {
  minimumVersion?: string;
  latestVersion?: string;
  /** Overrides the default Play Store link. */
  storeUrl?: string;
  /** Extra text shown on the update screen/banner. */
  message?: string;
};

export type UpdateStatus = 'ok' | 'optional' | 'required';

const POLICY_URL = process.env.EXPO_PUBLIC_VERSION_POLICY_URL;
const TIMEOUT_MS = 5000;

export const hasVersionPolicySource = Boolean(POLICY_URL);

/** Installed binary version (unaffected by OTA updates). Null on web. */
export const installedVersion = Application.nativeApplicationVersion;

export function defaultStoreUrl() {
  return `https://play.google.com/store/apps/details?id=${Application.applicationId}`;
}

/** Returns null on any failure: a flaky network must never lock users out. */
export async function fetchVersionPolicy(): Promise<VersionPolicy | null> {
  if (!POLICY_URL) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(POLICY_URL, { signal: controller.signal, headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) return null;
    return (await res.json()) as VersionPolicy;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Compares dotted numeric versions: negative if a < b, 0 if equal, positive if a > b. */
export function compareVersions(a: string, b: string) {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function getUpdateStatus(current: string | null, policy: VersionPolicy | null): UpdateStatus {
  if (!current || !policy) return 'ok';
  if (policy.minimumVersion && compareVersions(current, policy.minimumVersion) < 0) return 'required';
  if (policy.latestVersion && compareVersions(current, policy.latestVersion) < 0) return 'optional';
  return 'ok';
}
