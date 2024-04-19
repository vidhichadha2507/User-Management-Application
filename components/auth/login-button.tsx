"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { LoginForm } from "./login-form";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

/**
 * Renders a login button component.
 *
 * @param {LoginButtonProps} props - The component props.
 * @param {ReactNode} props.children - The content of the button.
 * @param {string} [props.mode="redirect"] - The mode of the button (either "redirect" or "modal").
 * @param {boolean} [props.asChild] - Whether the button is used as a child component.
 * @returns {JSX.Element} The rendered login button component.
 */
export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className=" p-0 w-auto bg-transparent border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={onClick} className=" cursor-pointer">
      {children}
    </span>
  );
};
