"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ResetSchema } from "@/schemas/index";
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
import { useState, useTransition } from "react";

import { reset } from "@/actions/reset";

/**
 * Component for the reset password form.
 * This form allows users to reset their password by providing their email address.
 */
export const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  /**
   * Handles form submission.
   * Resets the error and success messages, then calls the reset function.
   * If the reset function returns an error, sets the error message.
   * If the reset function is successful, sets the success message.
   * @param data - The form data containing the email address.
   */
  const onSubmit = (data: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(data).then((data) => {
        if (data?.error) {
          setError(data?.error);
        } else {
          setSuccess(data?.success);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your Password?"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
            disabled={isPending}
          >
            Send reset mail
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
