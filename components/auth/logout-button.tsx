import { logout } from "@/actions/logout";

interface LogoutButtonProps {
  children: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const handleLogout = () => {
    logout();
  };

  return (
    <span onClick={handleLogout} className=" cursor-pointer">
      {children}
    </span>
  );
};
