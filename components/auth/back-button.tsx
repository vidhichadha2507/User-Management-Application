import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
  label: string;
  href: string;
}

/**
 * Renders a back button component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The label text for the button.
 * @param {string} props.href - The URL to navigate to when the button is clicked.
 * @returns {JSX.Element} The rendered back button component.
 */
export const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button variant="link" size="sm" className=" font-normal w-full" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
