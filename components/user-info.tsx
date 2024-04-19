"use client";

import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { usePathname } from "next/navigation";
import { useCurrentRole } from "@/hooks/use-current-role";
import { RoleGate } from "./auth/role-gate";
import { FormSuccess } from "./form-success";
import { Role } from "@prisma/client";
import { UserInfoDetails } from "./user-info-details";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  const pathname = usePathname();
  const role = useCurrentRole();

  return (
    <Card className=" w-[90%]">
      <CardHeader>
        <p className=" text-2xl font-semibold text-center">{label}</p>
      </CardHeader>

      <CardContent className=" space-y-4">
        {pathname === "/server" ? (
          <RoleGate allowedRole={[Role.MANAGER, Role.ADMIN]}>
            <FormSuccess message="You have access to this content" />
            <UserInfoDetails user={user} />
          </RoleGate>
        ) : (
          <UserInfoDetails user={user} />
        )}
      </CardContent>
    </Card>
  );
};
