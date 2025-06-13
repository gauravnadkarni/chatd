import { AuthError } from "../errors/auth-error";
import { createClientForServer } from "../supabase";
import { ThirdPartyAuthProviders } from "../types/ThirdPartyAuthProviders";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export class Auth {
  private cookieStore: ReadonlyRequestCookies;
  constructor(cookieStore: ReadonlyRequestCookies) {
    this.cookieStore = cookieStore;
  }
  initiateAuthWithThirdPartyProvider = async (
    provider: ThirdPartyAuthProviders,
    authCallback: string
  ) => {
    const supabase = await createClientForServer(this.cookieStore);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: authCallback,
      },
    });
    if (error) {
      throw new AuthError(error.message);
    }
    return data;
  };

  validateAuthCodeWithProvider = async (authCode: string) => {
    const supabase = await createClientForServer(this.cookieStore);
    const { data, error } =
      await supabase.auth.exchangeCodeForSession(authCode);
    if (error) {
      throw new AuthError(error.message);
    }
    return data;
  };

  getAuthUser = async () => {
    const supabase = await createClientForServer(this.cookieStore);
    const {
      data: { user: userFromSession },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw new AuthError(error.message, error);
    }
    return userFromSession!;
  };
}
