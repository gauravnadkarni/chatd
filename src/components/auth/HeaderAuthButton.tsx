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
      className={
        isActive
          ? "bg-white text-blue-600 hover:bg-white/90"
          : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
      }
      aria-label={ariaLabel}
    >
      {label}
    </Button>
  );
};
