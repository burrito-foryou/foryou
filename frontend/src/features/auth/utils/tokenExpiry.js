export const isTokenExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt;
};
