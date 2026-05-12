/**
 * Simple validation regex patterns.
 * (Used as fallbacks or for lightweight checks outside of Zod).
 */

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const validateEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

export const getPasswordStrength = (password) => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

export const formatValidationError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Invalid input';
};
