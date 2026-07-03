/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Route protection configurations.
 * Outlines public vs protected pathways within the Sales OS.
 */
export const AUTH_ROUTES = {
  public: ["/login", "/signup", "/forgot-password", "/reset-password"],
  protected: ["/dashboard", "/leads", "/pipeline", "/tasks", "/analytics", "/settings"],
  defaultRedirectAuthenticated: "dashboard",
  defaultRedirectUnauthenticated: "login"
};

/**
 * Checks if a given route is public or requires authentication.
 * @param pathName The name or ID of the tab/route.
 */
export const isPublicRoute = (pathName: string): boolean => {
  // If in tab-routing, check against the tab name
  const cleanPath = pathName.startsWith("/") ? pathName.slice(1) : pathName;
  return AUTH_ROUTES.public.some(route => {
    const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
    return cleanRoute === cleanPath;
  });
};

/**
 * Client-Side Middleware guard logic.
 * Decides whether to redirect or allow passage.
 */
export const checkRouteAuthorization = (
  currentPath: string,
  isAuthenticated: boolean
): { allowed: boolean; redirect: string | null } => {
  const isPublic = isPublicRoute(currentPath);

  if (isAuthenticated && isPublic) {
    // Authenticated user trying to access public auth page (e.g., login, signup) -> redirect to dashboard
    return { allowed: false, redirect: AUTH_ROUTES.defaultRedirectAuthenticated };
  }

  if (!isAuthenticated && !isPublic) {
    // Unauthenticated user trying to access a protected app page -> redirect to login
    return { allowed: false, redirect: AUTH_ROUTES.defaultRedirectUnauthenticated };
  }

  // Otherwise, allow passage
  return { allowed: true, redirect: null };
};
