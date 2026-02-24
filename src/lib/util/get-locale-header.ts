import { getLocale } from "@lib/data/locale-actions"
import { DEFAULT_LOCALE } from "@lib/i18n/constants"

export async function getLocaleHeader() {
  const locale = (await getLocale()) ?? DEFAULT_LOCALE
  return {
    "x-medusa-locale": locale,
  } as const
}
