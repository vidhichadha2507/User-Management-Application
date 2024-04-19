const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center gradient">
      {children}
    </div>
  );
};

export default AuthLayout;
