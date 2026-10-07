const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (v: string) =>
  EMAIL_RE.test(v.trim()) ? undefined : 'Enter a valid email address';

export const validatePassword = (v: string) =>
  v.length >= 8 ? undefined : 'Password must be at least 8 characters';

export const validateName = (v: string) => (v.trim() ? undefined : 'Enter your name');
