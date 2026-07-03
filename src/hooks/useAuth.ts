/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuth as useContextAuth } from "../providers/AuthProvider";

/**
 * Custom hook to access global Synity authentication state.
 * Returns current User Profile, loading status, demo mode state, and Auth functions (login, signup, logout, etc).
 */
export const useAuth = () => {
  return useContextAuth();
};
