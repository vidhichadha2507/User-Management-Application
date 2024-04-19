"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

/**
 * Renders the ClientPage component.
 *
 * @returns The rendered ClientPage component.
 */
const ClientPage = () => {
  const user = useCurrentUser();

  return <UserInfo user={user} label="📱 User Component"></UserInfo>;
};

export default ClientPage;
