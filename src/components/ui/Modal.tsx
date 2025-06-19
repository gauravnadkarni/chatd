"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogProps,
} from "./dialog";
import { cn } from "@/lib/utils";

export interface ModalProps extends Omit<DialogProps, "open" | "onOpenChange"> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

const Modal = React.forwardRef<React.ElementRef<typeof Dialog>, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      footerContent,
      className,
      showCloseButton = true,
      size = "md",
      ...props
    },
    ref
  ) => {
    return (
      <Dialog
        ref={ref}
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
        {...props}
      >
        <DialogContent
          className={cn("sm:max-w-[425px]", sizeMap[size], className)}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="py-4">{children}</div>

          {footerContent && <DialogFooter>{footerContent}</DialogFooter>}

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);

Modal.displayName = "Modal";

export { Modal };
