interface HeaderProps {
  label: string;
}

/**
 * Renders the header component for authentication.
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The label to be displayed below the header.
 * @returns {JSX.Element} The rendered header component.
 */
export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-3xl font-semibold">🔐 Auth</h1>
      <p className=" text-muted-foreground  text-sm">{label}</p>
    </div>
  );
};
