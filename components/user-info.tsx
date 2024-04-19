"use client";

import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "./ui/card";
import { UserInfoDetails } from "./user-info-details";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

/**
 * Renders the user information component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object.
 * @param {string} props.label - The label for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className=" w-[90%]">
      <CardHeader>
        <p className=" text-2xl font-semibold text-center">{label}</p>
      </CardHeader>

      <CardContent className=" space-y-4">
        <UserInfoDetails user={user} />
      </CardContent>
    </Card>
  );
};
