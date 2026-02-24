"use client"

import { useTranslation } from "@lib/i18n/i18n-context"

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAFA" }}>
      <div className="relative py-16 sm:py-20 overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #C9A84C 0%, transparent 50%)" }} />
        <div className="content-container relative z-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">{t("pages.contactTag")}</span>
            <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">{t("pages.contactTitle")}</h1>
        </div>
      </div>

      <div className="content-container py-14 sm:py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-xl font-medium text-[#1a1a1a] mb-6">{t("pages.contactInfo")}</h2>
              <div className="flex flex-col gap-5">
                {[
                  { icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z", label: t("pages.contactAddress"), value: t("pages.contactAddressVal") },
                  { icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z", label: t("pages.contactPhone"), value: "+995 555 123 456" },
                  { icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", label: t("pages.contactEmail"), value: "info@chantebis.ge" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white border border-gray-100">
                    <svg className="w-5 h-5 text-[#C9A84C] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <div>
                      <span className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium">{item.label}</span>
                      <p className="text-[15px] text-[#1a1a1a] mt-1">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">{t("pages.contactHours")}</h3>
              <div className="text-gray-500 text-[13px] font-light flex flex-col gap-1">
                <p>{t("pages.contactMonFri")}</p>
                <p>{t("pages.contactSat")}</p>
                <p>{t("pages.contactSun")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8">
            <h2 className="text-xl font-medium text-[#1a1a1a] mb-6">{t("pages.contactForm")}</h2>
            <form className="flex flex-col gap-5">
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium mb-2 block">{t("pages.contactName")}</label>
                <input type="text" className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-[#C9A84C] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium mb-2 block">{t("pages.contactEmail")}</label>
                <input type="email" className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-[#C9A84C] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium mb-2 block">{t("pages.contactMessage")}</label>
                <textarea rows={5} className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-[#C9A84C] focus:outline-none transition-colors resize-none" />
              </div>
              <button type="submit" className="px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase font-bold bg-[#C9A84C] text-[#050505] hover:bg-[#d4b65e] transition-colors">
                {t("pages.contactSend")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
