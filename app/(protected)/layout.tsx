import Navbar from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

/**
 * Represents the layout component for the protected routes.
 * @param {React.ReactNode} children - The child components to be rendered within the layout.
 * @returns {React.ReactNode} - The protected layout component.
 */
const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-4 items-center gradient">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
