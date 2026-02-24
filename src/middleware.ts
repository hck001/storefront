import { NextRequest, NextResponse } from "next/server"

const COUNTRY_CODE = "ge"

/**
 * Single-country middleware: Georgia only.
 * No /ge prefix in URLs - rewrites internally to /ge/... for Next.js routing.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets
  if (pathname.includes(".")) {
    return NextResponse.next()
  }

  const firstSegment = pathname.split("/")[1]?.toLowerCase()

  // If URL already has /ge prefix, redirect to remove it
  if (firstSegment === COUNTRY_CODE) {
    const newPath = pathname.replace(/^\/ge/, "") || "/"
    const queryString = request.nextUrl.search || ""
    const redirectUrl = `${request.nextUrl.origin}${newPath}${queryString}`
    return NextResponse.redirect(redirectUrl, 301)
  }

  // Rewrite all requests to /ge/... internally for Next.js [countryCode] routing
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = `/${COUNTRY_CODE}${pathname}`

  const response = NextResponse.rewrite(rewriteUrl)

  // Set cache id cookie if not present
  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  if (!cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", crypto.randomUUID(), {
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
