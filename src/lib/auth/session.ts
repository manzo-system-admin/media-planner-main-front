// Firebase Hosting's rewrite to Cloud Functions only forwards a cookie
// literally named "__session" to the origin — any other name is stripped
// before the request reaches the function. This name is fixed by Firebase,
// not a style choice.
export const SESSION_COOKIE = "__session";
export const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
