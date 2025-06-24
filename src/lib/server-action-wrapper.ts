import { Session } from "@supabase/supabase-js";
import { AuthError } from "./errors/auth-error";
import { handleError } from "./helpers";
import { createClientForServer } from "./supabase-server";
import { ServerActionWrapper } from "./types/Wrappers";

export async function serverActionWrapper<T>(
  action: ServerActionWrapper<T>,
  session?: Session
) {
  try {
    const result = await action(session);
    return { success: true, data: result };
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function serverActionWrapperWithoutAuthCheck<T>(
  action: ServerActionWrapper<T>
) {
  return serverActionWrapper(action);
}

export async function serverActionWrapperWithAuthCheck<T>(
  action: ServerActionWrapper<T>
) {
  try {
    const supabase = await createClientForServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new AuthError("Unauthorized");
    }
    return serverActionWrapper(action, session);
  } catch (error: unknown) {
    return handleError(error);
  }
}
