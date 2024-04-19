import Navbar from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-4 items-center  bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400  to-purple-800 ]">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
