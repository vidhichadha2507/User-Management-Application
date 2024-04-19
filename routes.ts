/**
 * Array of routes which are accessible by everyone.
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/",
  "/auth/new-verification",
  "/api/organizations",
];

/**
 * Array of authentication routes.
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are considered to be API authentication routes.
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The default login redirect path.
 * Users will be redirected to this path after successful login.
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
