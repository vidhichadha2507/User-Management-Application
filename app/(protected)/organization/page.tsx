"use client";

import * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrganizationSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  deleteOrganization,
  organization,
  updateOrganization,
} from "@/actions/organization";

import { CrossCircledIcon, GearIcon } from "@radix-ui/react-icons";

import { BeatLoader } from "react-spinners";
import { OrganizationResponse } from "@/models/User";
import { RoleGate } from "@/components/auth/role-gate";
import { Role } from "@prisma/client";

const OrganizationPage = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>(
    []
  );
  const [orgId, setOrgId] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0); // add this line to your component

  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof OrganizationSchema>>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  useEffect(() => {
    setLoading(true);
    fetch("/api/organizations")
      .then((response) => response.json())
      .then((data) => {
        setOrganizations(data);
        setLoading(false);
        form.reset({
          name: "",
          email: "",
        });
        console.log(organizations);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [fetchTrigger]);

  const handleEdit = (id: string) => {
    setIsEdit(true);
    console.log(isEdit);

    const organizationToEdit = organizations.find((org) => org.id === id);
    if (organizationToEdit) {
      console.log(organizationToEdit);
      setOrgId(organizationToEdit.id);
      console.log(isEdit);
      if (!loading) {
        form.reset({
          name: organizationToEdit.name,
          email: organizationToEdit.manager.email,
        });
      }
    }
  };
  const handleDelete = (id: string) => {
    setIsDelete(true);
    const organizationToDelete = organizations.find((org) => org.id === id);
    if (organizationToDelete) {
      deleteOrganization(organizationToDelete.id).then((data) => {
        if (data?.error) {
          setError(data?.error);
        }
        if (data?.success) {
          setIsDelete(false);
          setSuccess(data?.success);
          setFetchTrigger((prev) => prev + 1);
        }
      });
    }
  };

  const onSubmit = (data: z.infer<typeof OrganizationSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      if (isEdit) {
        // update organization
        updateOrganization(orgId, data)
          .then((data) => {
            if (data?.error) {
              setError(data?.error);
            }
            if (data?.success) {
              setIsEdit(false);
              console.log("Checked");

              form.reset();
              setSuccess(data?.success);
              setFetchTrigger((prev) => prev + 1);
            }
          })
          .catch(() => {
            setError("Something went wrong");
          });
      } else {
        organization(data)
          .then((data) => {
            if (data?.error) {
              setError(data?.error);
            }
            if (data?.success) {
              form.reset();
              setSuccess(data?.success);
              setFetchTrigger((prev) => prev + 1);
            }
          })
          .catch(() => {
            setError("Something went wrong");
          });
      }
    });
  };

  return (
    <div className=" flex flex-row gap-5 w-[90%]">
      <Card className=" w-[50%]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            {" "}
            💡 Create Organization
          </p>
        </CardHeader>
        <RoleGate allowedRole={[Role.ADMIN]}>
          <CardContent className=" space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className=" space-y-4 mb-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Organization Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your Organization Name"
                            type="text"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Manager email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your organization's manager email"
                            type="email"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button
                  type="submit"
                  disabled={isPending}
                  className=" bg-black hover:bg-gray-700 transition-colors duration-200 mt-2"
                >
                  {isEdit ? "Edit Organization" : "Create Organization"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </RoleGate>
      </Card>

      <Card className=" w-[50%]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            {" "}
            🏣 All Organizations
          </p>
        </CardHeader>
        <CardContent className=" space-y-6">
          {loading && (
            <div className=" w-full flex justify-center  align-middle">
              <BeatLoader />
            </div>
          )}
          {!loading && organizations.length === 0 && (
            <p className=" text-center text-sm font-medium">
              No organizations found
            </p>
          )}
          {!loading && (
            <>
              <div className=" flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <p className=" w-[80px] text-sm  font-medium">Name</p>
                <p className="  w-[120px]  text-sm  font-medium ">Manager</p>
                <p className="  w-[90px] text-sm  font-medium ">Actions</p>
              </div>
              <div className=" flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="w-full">
                  {organizations.map((organization) => (
                    <div
                      key={organization.id}
                      className=" flex w-full flex-row items-center justify-between  p-3"
                    >
                      <p className=" w-[80px] text-sm  font-medium">
                        {organization.name}
                      </p>
                      <p className=" w-[120px] text-sm  font-medium ">
                        {organization.manager.name}
                      </p>
                      <p className=" w-[80px] text-sm flex gap-4  font-medium ">
                        <GearIcon
                          onClick={() => handleEdit(organization.id)}
                          className=" h-5 w-5 cursor-pointer "
                        />
                        <CrossCircledIcon
                          onClick={() => handleDelete(organization.id)}
                          className="text-red-500 h-5 w-5 cursor-pointer"
                        />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default OrganizationPage;
