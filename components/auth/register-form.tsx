"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RegisterSchema } from "@/schemas/index";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { register } from "@/actions/register";
import { getAllOrganizations } from "@/data/organization";
import { Organization } from "@prisma/client";
import { usePathname } from "next/navigation";
import { MultiSelect } from "react-multi-select-component";
import { OrganizationModel } from "@/models/User";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const organizations = useRef<Organization[]>([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  const [success, setSuccess] = useState<string | undefined>("");
  const [dropDown, setDropDown] = useState<OrganizationModel[]>([]);

  useMemo(() => {
    fetch("/api/organizations") // replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        organizations.current = data;
        setLoading(false);
        setDropDown(
          data.map((org: any) => ({
            label: org.name,
            value: org.id,
          }))
        );
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(data, selected).then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSuccess(data.success);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Please create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your name"
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="example@gmail.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Organizations
            </div>
            <MultiSelect
              options={dropDown}
              value={selected}
              onChange={setSelected}
              hasSelectAll={false}
              isLoading={loading}
              labelledBy="Select"
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 transition-colors duration-200"
            disabled={isPending}
          >
            Create an Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
