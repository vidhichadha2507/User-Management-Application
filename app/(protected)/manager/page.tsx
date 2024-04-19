"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

import { currentUser } from "@/lib/auth";
import { OrganizationResponse, OrganizationUsers } from "@/models/User";
import { CrossCircledIcon, GearIcon } from "@radix-ui/react-icons";
import { use, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

const ServerPage = () => {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<OrganizationUsers[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<OrganizationUsers>();
  const [isSelectedOrganization, setIsSelectedOrganization] = useState(false);
  const check = "hello";
  useEffect(() => {
    setLoading(true);
    fetch("/api/organizationById")
      .then((response) => response.json())
      .then((data) => {
        setOrganizations(data.organizations);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  const handleView = (organization: OrganizationUsers) => {
    setSelectedOrganization(organization);
    setIsSelectedOrganization(true);
  };

  return (
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
                <Card key={organization.id} className="w-[40%] h-[180px] mb-6 ">
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
  );
};

export default ServerPage;
