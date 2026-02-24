import { cookies } from "next/headers"
import { LOCALE_COOKIE_NAME, DEFAULT_LOCALE } from "./constants"
import { getDictionary } from "./get-dictionary"

/**
 * Server-side helper to get the dictionary based on the locale cookie.
 * Use this in generateMetadata and server components.
 */
export async function getServerDictionary() {
  const cookieStore = await cookies()
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? DEFAULT_LOCALE
  return getDictionary(locale)
}
