export function isEmailVerified(auth: { email_verified?: boolean }) {
  return auth.email_verified === true;
}
