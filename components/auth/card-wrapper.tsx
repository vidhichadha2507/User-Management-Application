"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./social";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

/**
 * Renders a card wrapper component.
 *
 * @param {CardWrapperProps} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the card.
 * @param {string} props.headerLabel - The label for the card header.
 * @param {string} props.backButtonLabel - The label for the back button.
 * @param {string} props.backButtonHref - The href for the back button.
 * @param {boolean} props.showSocial - Determines whether to show the social component.
 * @returns {JSX.Element} The rendered card wrapper component.
 */
export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref}></BackButton>
      </CardFooter>
    </Card>
  );
};
