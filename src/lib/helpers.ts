import { AbstractError } from "./errors/abstract-error";
import { v4 as uuidv4 } from "uuid";
import { createClientForServer } from "./supabase-server";
import { ServiceError } from "./errors/service-error";

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

export async function uploadFileToServer(
  bucketName: string,
  file: File,
  folderPath: string = "",
  fileNameWithExtension?: string
) {
  const fileNameForUpload: string =
    fileNameWithExtension || getTemporaryFileName(file.name);
  const filePath = `${folderPath}/${fileNameForUpload}`;

  const supabase = await createClientForServer();
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error || data === null) {
    throw new ServiceError("Failed to upload file", error);
  }

  console.log(data, "supabase data upload bucket");

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData ? publicUrlData.publicUrl : null;

  return publicUrl;
}

export const getTemporaryFileName = (file: string) =>
  `${uuidv4()}.${file.split(".").pop()}`;
