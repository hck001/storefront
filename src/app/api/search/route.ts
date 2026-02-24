import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

// Cache region ID
let cachedRegionId: string | null = null

async function getGeorgiaRegionId(): Promise<string | null> {
  if (cachedRegionId) return cachedRegionId
  try {
    const res = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: { "x-publishable-api-key": API_KEY },
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = await res.json()
    const region = data.regions?.find((r: any) =>
      r.countries?.some((c: any) => c.iso_2 === "ge")
    )
    if (region) cachedRegionId = region.id
    return cachedRegionId
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || ""

  if (!q.trim()) {
    return NextResponse.json({ products: [] })
  }

  try {
    const regionId = await getGeorgiaRegionId()
    const params = new URLSearchParams({
      q,
      limit: "8",
      fields: "id,title,handle,thumbnail,*variants.calculated_price",
    })
    if (regionId) params.set("region_id", regionId)

    const res = await fetch(`${BACKEND_URL}/store/products?${params}`, {
      headers: { "x-publishable-api-key": API_KEY },
      cache: "no-store",
    })

    if (!res.ok) {
      return NextResponse.json({ products: [] })
    }

    const data = await res.json()

    // Smart relevance sorting:
    // 0 = title starts with query (best)
    // 1 = a word in title starts with query
    // 2 = title contains query somewhere
    // 3 = only description/other fields match
    const qLower = q.toLowerCase()
    const scoreProduct = (p: any): number => {
      const title = (p.title || "").toLowerCase()
      if (title.startsWith(qLower)) return 0
      const words = title.split(/\s+/)
      if (words.some((w: string) => w.startsWith(qLower))) return 1
      if (title.includes(qLower)) return 2
      return 3
    }

    const products = (data.products || []).sort((a: any, b: any) => {
      return scoreProduct(a) - scoreProduct(b)
    })
    return NextResponse.json({ products })
  } catch (err: any) {
    console.error("[search] error:", err?.message)
    return NextResponse.json({ products: [] })
  }
}
