"use server";

import { cookies } from "next/headers";
import { serverActionWrapper } from "../server-action-wrapper";
import { Auth } from "../services/auth";
import { ThirdPartyAuthProviders } from "../types/ThirdPartyAuthProviders";
import { setupNewUser } from "../services/user";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const authWithProvider = async (provider: ThirdPartyAuthProviders) => {
  const serverAction = async () => {
    const auth = new Auth(await cookies());
    const data = await auth.initiateAuthWithThirdPartyProvider(
      provider,
      `${baseUrl}/auth/callback`
    );
    return data;
  };
  return serverActionWrapper(serverAction);
};

export const validateAuthWithProvider = async (authCode: string) => {
  const serverAction = async () => {
    const auth = new Auth(await cookies());
    const data = await auth.validateAuthCodeWithProvider(authCode);
    const session = data.session;

    await setupNewUser(
      session.user.id,
      session.user.email!,
      session.user.user_metadata.full_name || ""
    );
    return data;
  };

  return serverActionWrapper(serverAction);
};
