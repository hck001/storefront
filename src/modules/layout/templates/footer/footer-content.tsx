"use client"

import { useState } from "react"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslation } from "@lib/i18n/i18n-context"

type FooterContentProps = {
  collections: { id: string; handle: string; title: string }[]
  productCategories: { id: string; handle: string; name: string; parent_category: any }[]
}

export default function FooterContent({ collections, productCategories }: FooterContentProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubscribe = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus("error")
      return
    }
    // Store subscriber email in localStorage
    const subs = JSON.parse(localStorage.getItem("newsletter_subs") || "[]")
    if (!subs.includes(email)) subs.push(email)
    localStorage.setItem("newsletter_subs", JSON.stringify(subs))
    setStatus("success")
    setEmail("")
    setTimeout(() => setStatus("idle"), 4000)
  }

  return (
    <footer style={{ backgroundColor: "#050505" }}>
      {/* Newsletter */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 80% 50%, #C9A84C 0%, transparent 50%)",
          }}
        />
        <div className="content-container py-16 sm:py-20 relative z-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">
                {t("footer.newsletter")}
              </span>
              <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
            </div>
            <h3 className="text-white text-2xl sm:text-3xl font-light tracking-tight leading-snug">
              {t("footer.newsletterTitle")}
              <span className="text-[#C9A84C]">{t("footer.newsletterHighlight")}</span>
              {t("footer.newsletterTitleEnd")}
            </h3>
            <p className="text-white/40 text-sm font-light max-w-sm">
              {t("footer.newsletterDesc")}
            </p>
            <div className="flex gap-0 w-full max-w-md mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status !== "idle") setStatus("idle") }}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 px-5 py-3.5 text-sm bg-white/[0.04] border border-white/10 border-r-0 text-white placeholder-white/25 focus:outline-none focus:border-[#C9A84C]/50 focus:bg-white/[0.06] transition-all"
              />
              <button
                onClick={handleSubscribe}
                className="px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase font-bold bg-[#C9A84C] text-[#050505] hover:bg-[#d4b65e] transition-colors flex-shrink-0"
              >
                {t("footer.subscribe")}
              </button>
            </div>
            {status === "success" && (
              <p className="text-[#C9A84C] text-sm font-light animate-pulse">{t("footer.subscribeSuccess")}</p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-sm font-light">{t("footer.subscribeError")}</p>
            )}
          </div>
        </div>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Main Footer */}
      <div className="content-container py-16 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-4 flex flex-col gap-6">
            <LocalizedClientLink href="/" className="inline-block">
              <img src="/logo.svg" alt="Bags" className="h-10 w-auto" />
            </LocalizedClientLink>
            <p className="text-white/35 text-sm font-light leading-relaxed max-w-xs">
              {t("footer.brandDesc")}
            </p>
            <div className="flex gap-3 mt-1">
              {[
                { label: "Instagram", path: "M7.8 2h8.4C19 2 22 5 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C5 22 2 19 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" },
                { label: "Facebook", path: "M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04z" },
                { label: "TikTok", path: "M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-white/[0.08] hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 transition-all duration-300 group"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white/30 group-hover:text-[#C9A84C] transition-colors" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          {productCategories && productCategories.length > 0 && (
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">
                {t("footer.categories")}
              </span>
              <ul className="flex flex-col gap-3">
                {productCategories.slice(0, 6).map((c) => {
                  if (c.parent_category) return null
                  return (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-white/30 text-[13px] font-light hover:text-[#C9A84C] transition-colors duration-300"
                        href={`/categories/${c.handle}`}
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Collections */}
          {collections && collections.length > 0 && (
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">
                {t("footer.collections")}
              </span>
              <ul className="flex flex-col gap-3">
                {collections.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      className="text-white/30 text-[13px] font-light hover:text-[#C9A84C] transition-colors duration-300"
                      href={`/collections/${c.handle}`}
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">
              {t("footer.information")}
            </span>
            <ul className="flex flex-col gap-3">
              <li>
                <LocalizedClientLink href="/store" className="text-white/30 text-[13px] font-light hover:text-[#C9A84C] transition-colors duration-300">
                  {t("footer.shop")}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/about" className="text-white/30 text-[13px] font-light hover:text-[#C9A84C] transition-colors duration-300">
                  {t("footer.aboutUs")}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/contact" className="text-white/30 text-[13px] font-light hover:text-[#C9A84C] transition-colors duration-300">
                  {t("footer.contactUs")}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/shipping" className="text-white/30 text-[13px] font-light hover:text-[#C9A84C] transition-colors duration-300">
                  {t("footer.shippingPolicy")}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/returns" className="text-white/30 text-[13px] font-light hover:text-[#C9A84C] transition-colors duration-300">
                  {t("footer.returnPolicy")}
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">
              {t("footer.contact")}
            </span>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#C9A84C]/60 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-white/30 text-[13px] font-light leading-relaxed">
                  Tbilisi, {t("common.georgia")}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#C9A84C]/60 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="text-white/30 text-[13px] font-light">
                  info@chantebis.ge
                </span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#C9A84C]/60 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="text-white/30 text-[13px] font-light">
                  +995 555 123 456
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.04]">
        <div className="content-container py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Text className="text-white/20 text-xs font-light">
              © {new Date().getFullYear()} Bag World. {t("footer.allRightsReserved")}
            </Text>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/20 text-xs font-light hover:text-white/40 transition-colors duration-300">
                {t("footer.privacyPolicy")}
              </a>
              <div className="w-[3px] h-[3px] rounded-full bg-white/10" />
              <a href="#" className="text-white/20 text-xs font-light hover:text-white/40 transition-colors duration-300">
                {t("footer.termsConditions")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
