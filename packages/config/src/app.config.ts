export const APP_CONFIG = {
  name: "Xaalis",
  version: "0.1.0",
  defaultCurrency: "XOF",
  defaultLocale: "fr",
  supportedLocales: ["fr", "en"] as const,
} as const;

export type SupportedLocale = (typeof APP_CONFIG.supportedLocales)[number];
