"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Renders the navigation bar component.
 * @returns The JSX element representing the navigation bar.
 */
const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className=" bg-secondary flex justify-between mt-4 items-center p-4 rounded-xl w-[90%] shadow-sm">
      <div className="flex gap-x-2">
        <Button asChild variant={pathname === "/user" ? "default" : "outline"}>
          <Link href="/user">User</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/manager" ? "default" : "outline"}
        >
          <Link href="/manager">Manager</Link>
        </Button>

        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/organization" ? "default" : "outline"}
        >
          <Link href="/organization">Organization</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};

export default Navbar;
