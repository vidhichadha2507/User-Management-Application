import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
  message?: string;
}

/**
 * Renders a success message for a form submission.
 * @param {Object} props - The component props.
 * @param {string} props.message - The success message to display.
 * @returns {JSX.Element | null} The rendered success message component.
 */
export const FormSuccess = ({
  message,
}: FormSuccessProps): JSX.Element | null => {
  if (!message) return null;

  return (
    <div className=" bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircledIcon className=" h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
