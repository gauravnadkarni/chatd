//import { Resend } from "resend";
import { getComponentAsString } from "@/components/email-templates/WelcomeEmail";

//const resend = new Resend(process.env.RESEND_API_KEY!);

export const getNewUserEmailAsString = async (email: string) => {
  const html = await getComponentAsString({ email });
  return html;
};
