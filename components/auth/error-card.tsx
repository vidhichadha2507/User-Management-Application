import { authRoutes } from "@/routes";
import { Card, CardHeader } from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";

/**
 * Renders an error card component.
 * This component displays an error message and a back button.
 */
export const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oops something went wrong"></Header>
      </CardHeader>
      <CardHeader>
        <BackButton label="Back to Login" href={authRoutes[0]}></BackButton>
      </CardHeader>
    </Card>
  );
};
