"use client";
import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import { Role } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
  const role = useCurrentRole();

  const onServerActionClick = () => {
    // Call admin only server actions
    admin().then((response) => {
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
    });
  };

  const onApiRouteClick = () => {
    // Call admin only API routes
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("Allowed API route");
      } else {
        toast.error("Forbidden API route");
      }
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center"> 🔑 Admin</p>
      </CardHeader>
      <CardContent className=" space-y-4">
        <RoleGate allowedRole={Role.ADMIN}>
          <FormSuccess message="You have access to this content" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className=" text-sm font-medium">Admin Only API Routes</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className=" text-sm font-medium">Admin Only Server Actions</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
