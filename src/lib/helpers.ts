import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AbstractError } from "./errors/abstract-error";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isValidationError = (
  error: unknown
): error is { name: string; errors: Record<string, unknown> } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    "errors" in error &&
    (error as { name: string }).name === "ValidationError"
  );
};

export const handleError = (
  error: unknown
): { error: string; code: number; payload?: unknown } => {
  if (error instanceof AbstractError) {
    return {
      error: error.message,
      code: error.code,
      payload: error.payload as Record<string, unknown>,
    };
  } else if (isValidationError(error)) {
    return { error: "Validation Error", code: 400, payload: error.errors };
  } else if (error instanceof Error) {
    return { error: error.message, code: 500, payload: {} };
  }
  return { error: "Unknown error occured", code: 500, payload: {} };
};
