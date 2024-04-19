import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

/**
 * Renders an error message for a form.
 *
 * @param {Object} props - The component props.
 * @param {string} props.message - The error message to display.
 * @returns {JSX.Element | null} The rendered error message component.
 */
export const FormError = ({ message }: FormErrorProps): JSX.Element | null => {
  if (!message) return null;

  return (
    <div className="w-full justify-center bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
