import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';

type Props = TextInputProps & {
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
};

/** Dark rounded input with a leading icon + divider, and an eye toggle for passwords. */
export function AuthField({ icon, error, secureTextEntry, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(true);
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <Ionicons name={icon} size={20} color={Brand.muted} />
        <View style={styles.divider} />
        <TextInput
          accessibilityLabel={rest.placeholder}
          placeholderTextColor={Brand.muted}
          selectionColor={Brand.accent}
          secureTextEntry={isPassword && hidden}
          style={[styles.input, style]}
          {...rest}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={Brand.muted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.one },
  field: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Brand.border,
    backgroundColor: Brand.field,
  },
  fieldError: { borderColor: Brand.danger },
  divider: { width: 1, height: 20, backgroundColor: Brand.border },
  input: { flex: 1, color: Brand.text, fontSize: 16, paddingVertical: Spacing.two },
  error: { color: Brand.danger, fontSize: 13, paddingLeft: Spacing.one },
});
