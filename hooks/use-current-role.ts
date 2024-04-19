import { useSession } from "next-auth/react";

/**
 * Custom hook to get the current role of the user.
 * @returns The current role of the user, or undefined if the session is not available.
 */
export const useCurrentRole = () => {
  const session = useSession();
  return session?.data?.user?.role;
};
