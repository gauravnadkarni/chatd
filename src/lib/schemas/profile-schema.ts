import { z } from "zod";

const MAX_FILE_SIZE = 819200; // 800KB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// --- Shared Base Schema (for fields common to both client and server) ---
const baseProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

// --- Client-Side Schema ---
export const clientProfileSchema = baseProfileSchema.extend({
  avatar: z
    .custom<FileList>(
      (value) => {
        // Ensure it's a FileList on the client
        return typeof window !== "undefined" && value instanceof FileList;
      },
      {
        message: "Expected a FileList for avatar upload.",
      }
    )
    .refine(
      (files) => files.length === 0 || files[0]?.size < MAX_FILE_SIZE,
      "Max file size is 800KB"
    )
    .refine(
      (files) =>
        files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      "Only .jpg, .jpeg, .png, and .webp formats are supported"
    )
    .optional()
    .transform((files) => (files?.length ? files : undefined)), // Transform empty FileList to undefined
});

// --- Server-Side Schema ---
// On the server, `formData.get('avatar')` will return a `File` object (Node's File) or null.
export const serverProfileSchema = baseProfileSchema.extend({
  avatar: z
    .any() // Use z.any() because the server's 'File' is not the browser's File
    .refine((file) => {
      // If no file, it's valid
      if (!file) return true;
      // If file exists, ensure it's a Node.js File object (or similar) and has size
      return file instanceof File && file.size > 0;
    }, "Expected a file object for avatar.")
    .refine((file) => {
      // If no file or size is within limits
      return !file || file.size < MAX_FILE_SIZE;
    }, "Max file size is 800KB")
    .refine((file) => {
      // If no file or type is accepted
      return !file || ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Only .jpg, .jpeg, .png, and .webp formats are supported")
    .optional(), // file can be undefined/null if no file was uploaded
});

export type ClientProfileFormData = z.infer<typeof clientProfileSchema>;
export type ServerProfileFormData = z.infer<typeof serverProfileSchema>;
