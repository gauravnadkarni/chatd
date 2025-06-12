"use client";

import { Button } from "@/components/ui/button";

interface HeaderAuthButtonProps {
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  ariaLabel?: string;
}

export const HeaderAuthButton = ({
  isActive,
  onClick,
  label,
  ariaLabel,
}: HeaderAuthButtonProps) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className={isActive ? "" : ""}
      aria-label={ariaLabel}
    >
      {label}
    </Button>
  );
};
