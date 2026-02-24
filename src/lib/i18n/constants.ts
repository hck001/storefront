export const DEFAULT_LOCALE = "ka-GE"
export const SUPPORTED_LOCALES = ["ka-GE", "en-US", "ru-RU"] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
export const LOCALE_COOKIE_NAME = "_medusa_locale"
