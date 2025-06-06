export const defaultLocale = "en" as const;
export const locales = ["en"] as const;
export const languages = [{ code: "en", name: "English" }];
export type Locale = (typeof locales)[number];
