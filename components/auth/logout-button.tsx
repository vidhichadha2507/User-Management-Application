import { logout } from "@/actions/logout";

interface LogoutButtonProps {
  children: React.ReactNode;
}

/**
 * LogoutButton component.
 *
 * @param {ReactNode} children - The content to be displayed inside the LogoutButton component.
 * @returns {JSX.Element} - The rendered LogoutButton component.
 */
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
