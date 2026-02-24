"use server"

import { sdk } from "@lib/config"
import { LOCALE_COOKIE_NAME } from "@lib/i18n/constants"
import { revalidateTag } from "next/cache"
import { cookies as nextCookies } from "next/headers"
import { getAuthHeaders, getCacheTag, getCartId } from "./cookies"

/**
 * Gets the current locale from cookies
 */
export const getLocale = async (): Promise<string | null> => {
  try {
    const cookies = await nextCookies()
    return cookies.get(LOCALE_COOKIE_NAME)?.value ?? null
  } catch {
    return null
  }
}

/**
 * Sets the locale cookie
 */
export const setLocaleCookie = async (locale: string) => {
  const cookies = await nextCookies()
  cookies.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false, // Allow client-side access
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

/**
 * Updates the locale preference via SDK and stores in cookie.
 * Also updates the cart with the new locale if one exists.
 */
export const updateLocale = async (localeCode: string): Promise<string> => {
  const previousLocale = await getLocale()

  await setLocaleCookie(localeCode)

  // Update cart with the new locale if a cart exists
  const cartId = await getCartId()
  if (cartId) {
    try {
      const headers = {
        ...(await getAuthHeaders()),
      }

      await sdk.store.cart.update(cartId, { locale: localeCode }, {}, headers)

      const cartCacheTag = await getCacheTag("carts")
      if (cartCacheTag) {
        revalidateTag(cartCacheTag)
      }
    } catch (error) {
      // Revert cookie to previous locale on cart update failure
      if (previousLocale) {
        await setLocaleCookie(previousLocale)
      }
      console.error("Failed to update cart locale, reverted to previous locale:", error)
      return previousLocale ?? localeCode
    }
  }

  // Revalidate all relevant caches to refresh content with new locale
  const tagsToRevalidate = ["products", "categories", "collections", "regions", "locales"]
  for (const tag of tagsToRevalidate) {
    const cacheTag = await getCacheTag(tag)
    if (cacheTag) {
      revalidateTag(cacheTag)
    }
  }

  // Also revalidate without cache id prefix for any global caches
  for (const tag of tagsToRevalidate) {
    try {
      revalidateTag(tag)
    } catch {}
  }

  return localeCode
}
