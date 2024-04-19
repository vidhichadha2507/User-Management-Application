/**
 * AuthLayout component renders a layout for the authentication pages.
 *
 * @param {React.ReactNode} children - The child components to be rendered inside the layout.
 * @returns {React.ReactNode} The rendered layout component.
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center gradient">
      {children}
    </div>
  );
};

export default AuthLayout;
