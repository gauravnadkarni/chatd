import { Profile } from "@prisma/client";

export type ProfileModel = Profile;

export interface SearchProfilesOptions {
  query: string;
  limit?: number;
  orderBy?: "asc" | "desc";
  excludeIds?: string[];
  searchMode?: "contains" | "startsWith";
}
