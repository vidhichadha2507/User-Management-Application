import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

/**
 * Renders the Home component.
 *
 * @returns The JSX element representing the Home component.
 */
export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center  bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400  to-blue-800 ] ">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold text-white drop-shadow-md ">
          {" "}
          User Management System{" "}
        </h1>
        <p className="text-white text-lg">Simple Service to manage Users</p>
      </div>
      <LoginButton mode="modal" asChild>
        <Button variant="secondary" className=" mt-3" size="lg">
          Sign in
        </Button>
      </LoginButton>
    </main>
  );
}
