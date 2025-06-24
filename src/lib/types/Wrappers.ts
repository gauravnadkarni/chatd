import { Session } from "@supabase/supabase-js";

export type ServerActionWrapper<T> = (session?: Session) => Promise<T>;

export type ApiWrapper<T> = (
  session?: Session
) => Promise<T & { code: number; payload: unknown }>;
