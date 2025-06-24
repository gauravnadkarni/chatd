import { NextResponse } from "next/server";
import { handleError } from "./helpers";
import { ApiWrapper } from "./types/Wrappers";
import { createClientForServer } from "./supabase-server";
import { AuthError } from "./errors/auth-error";
import { Session } from "@supabase/supabase-js";

export async function apiWrapper<T>(
  action: ApiWrapper<T>,
  session?: Session,
  rawResponse: boolean = false
) {
  try {
    const result = await action(session);
    if (rawResponse) {
      const { payload } = result;
      return NextResponse.json(payload);
    }
    return NextResponse.json(
      { success: true, data: result.payload },
      { status: result.code || 200 }
    );
  } catch (error: unknown) {
    const response = handleError(error);
    return NextResponse.json(response, { status: response.code });
  }
}

export async function apiWrapperWithoutAuthCheck<T>(
  action: ApiWrapper<T>,
  rawResponse: boolean = false
) {
  return apiWrapper(action, undefined, rawResponse);
}

export async function apiWrapperWithAuthCheck<T>(
  action: ApiWrapper<T>,
  rawResponse: boolean = false
) {
  try {
    const supabase = await createClientForServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new AuthError("Unauthorized");
    }
    return apiWrapper(action, session, rawResponse);
  } catch (error: unknown) {
    const response = handleError(error);
    return NextResponse.json(response, { status: response.code });
  }
}
