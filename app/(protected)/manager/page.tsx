"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrganizationUsers } from "@/models/User";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

/**
 * ServerPage component displays a page that shows a list of organizations and their users.
 */
const ServerPage = () => {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<OrganizationUsers[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<OrganizationUsers>();
  const [isSelectedOrganization, setIsSelectedOrganization] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/organizationById")
      .then((response) => response.json())
      .then((data) => {
        setOrganizations(data.organizations);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  /**
   * Handles the view of a specific organization.
   * @param organization - The organization to view.
   */
  const handleView = (organization: OrganizationUsers) => {
    setSelectedOrganization(organization);
    setIsSelectedOrganization(true);
  };

  return (
    <RoleGate allowedRole={[Role.MANAGER, Role.ADMIN]}>
      <div className=" flex flex-row gap-4 w-[90%]">
        <Card className=" w-[60%] h-fit ">
          <CardHeader>
            <p className="text-2xl font-semibold text-center">
              {" "}
              🏣 Your Organizations
            </p>
          </CardHeader>
          <CardContent className=" mt-8  flex flex-wrap gap-5  justify-around ">
            {loading && (
              <div className=" w-full flex justify-center  align-middle">
                <BeatLoader />
              </div>
            )}

            {!loading && organizations.length === 0 && (
              <p className=" text-center text-sm font-medium">
                No organizations found under you
              </p>
            )}
            {!loading && organizations.length > 0 && (
              <>
                {organizations.map((organization) => (
                  <Card
                    key={organization.id}
                    className="w-[40%] h-[180px] mb-6 "
                  >
                    <CardHeader className="">
                      <p className=" text-[22px] text-center font-semibold">
                        {organization.name}
                      </p>
                    </CardHeader>
                    <CardContent className="">
                      <p
                        className="
                    text-[14px] text-center font-medium mb-4
                    "
                      >
                        Total Users :{organization.users?.length}{" "}
                      </p>
                      <Button
                        onClick={() => handleView(organization)}
                        className="w-full"
                        variant="default"
                      >
                        View
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </CardContent>
        </Card>
        <Card className=" w-[40%] h-[40vh]">
          {loading && (
            <div className=" w-full flex justify-center  align-middle">
              <BeatLoader />
            </div>
          )}
          {!loading && (
            <>
              <CardHeader>
                <p className="text-2xl font-semibold text-center">
                  {" "}
                  {isSelectedOrganization
                    ? `Users in ${selectedOrganization?.name}`
                    : "No Organization Selected"}
                </p>
              </CardHeader>
              <CardContent className=" mt-8 space-y-6">
                <div className=" flex flex-col items-start gap-4 justify-between rounded-lg border p-3 shadow-sm">
                  {/*  */}
                  <p className=" w-[80px] text-sm  font-medium">Names :-</p>
                  {isSelectedOrganization &&
                    selectedOrganization?.users?.map((user, index) => (
                      <p key={index} className=" w-[80px] text-sm  font-medium">
                        {user.name}
                      </p>
                    ))}
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </RoleGate>
  );
};

export default ServerPage;
