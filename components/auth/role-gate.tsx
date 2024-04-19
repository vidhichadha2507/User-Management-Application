"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { Role } from "@prisma/client";
import { FormError } from "../form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: Role[];
}

/**
 * RoleGate component is used to conditionally render content based on the user's role.
 * If the user's role is not included in the allowed roles, an error message is displayed.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered if the user's role is allowed.
 * @param {string[]} props.allowedRole - The roles allowed to view the content.
 * @returns {ReactNode} - The rendered content or an error message.
 */
export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();
  if (!allowedRole.includes(role)) {
    return (
      <FormError message="You do not have permission to view this content" />
    );
  }

  return <>{children}</>;
};
