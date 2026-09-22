import { Send, MapPin, Phone, Clock3, Facebook, Instagram, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoAsset from "../assets/alobaad-logo.jpg.asset.json";

function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2a9.84 9.84 0 0 0-8.5 14.8L2 22l5.34-1.5A9.98 9.98 0 1 0 12.04 2Zm0 17.98a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.17.9.87-3.1-.2-.32a8 8 0 1 1 6.92 3.83Zm4.45-6.06c-.24-.12-1.44-.7-1.66-.79-.23-.08-.4-.12-.57.13-.16.24-.63.79-.78.95-.14.17-.28.19-.52.07-.24-.12-1.03-.38-1.95-1.2a7.3 7.3 0 0 1-1.35-1.68c-.14-.24-.01-.37.11-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.56-.42h-.48c-.16 0-.43.06-.65.3-.22.24-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.18 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.65-1.16.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export function SiteFooter() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  
  const WA_MESSAGE = encodeURIComponent(t("hero.wa_msg"));

  const navLinks = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.destinations"), href: "#destinations" },
    { label: t("nav.flights"), href: "#flights" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  const services = [
    t("footer.svc1"),
    t("footer.svc2"),
    t("footer.svc3"),
    t("footer.svc4"),
  ];

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#0A1B2E]">
      {/* Top transition line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#159DD3]/20 to-transparent" />

      {/* Subtle paper-plane watermark */}
      <div className={`pointer-events-none absolute ${isRtl ? '-left-16' : '-right-16'} bottom-8 opacity-[0.03]`}>
        <Send className={`size-[360px] ${isRtl ? '-rotate-[20deg]' : 'rotate-[20deg]'} text-white`} />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-12 lg:pt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-4 lg:gap-12">

          {/* Col 1 — Brand */}
          <div className="col-span-2 lg:col-span-1">
            <a href="#home" className="flex items-center gap-3">
              <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0D2742] shadow-sm border border-white/10">
                <img src="/logo-new.png" alt={t("hero.brand")} className="h-full w-full object-cover scale-110" />
              </span>
              <span>
                <strong className="block text-base font-bold text-white">{t("meta.rootTitle").split(" ")[0]}</strong>
                <small className="block text-[10px] uppercase tracking-wide text-white/50">{t("meta.rootTitle").substring(t("meta.rootTitle").indexOf(" ") + 1)}</small>
              </span>
            </a>

            <p className="mt-5 max-w-xs text-sm font-medium leading-relaxed text-white/55">
              {t("footer.tagline")}
            </p>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/967738883371?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-[#159DD3]/15 px-4 py-3 text-sm font-bold text-[#159DD3] ring-1 ring-[#159DD3]/20 transition-all hover:bg-[#159DD3]/25 hover:ring-[#159DD3]/40 active:scale-[0.97]"
            >
              <WhatsAppIcon className="size-4" />
              {t("footer.contact_us")}
            </a>
          </div>

          {/* Col 2 — Quick links */}
          <div className="col-span-1">
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/40">{t("footer.quick_links")}</h4>
            <nav aria-label="Footer Navigation">
              <ul className="grid gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-white/60 transition-colors hover:text-[#159DD3]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 3 — Services */}
          <div className="col-span-1">
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/40">{t("footer.services")}</h4>
            <ul className="grid gap-3">
              {services.map((svc) => (
                <li key={svc} className="text-sm font-medium text-white/60">
                  {svc}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/40">{t("footer.contact_info")}</h4>
            <ul className="grid gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#159DD3]" />
                <span className="text-sm font-medium text-white/60">{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-[#159DD3]" />
                <a
                  href="tel:+967738883371"
                  dir="ltr"
                  className="text-sm font-medium text-white/60 transition-colors hover:text-white"
                >
                  +967 738 883 371
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-[#159DD3]" />
                <span className="text-sm font-medium text-white/60 whitespace-pre-line">{t("footer.hours")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-white/[0.07] py-8 sm:flex-row">
          {/* Copyright */}
          <p className="text-xs font-medium text-white/35">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-5">
            <a
              href="#"
              aria-label="Facebook"
              className="text-white/40 transition-colors hover:text-white active:scale-90"
            >
              <Facebook className="size-5" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-white/40 transition-colors hover:text-white active:scale-90"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-white/40 transition-colors hover:text-white active:scale-90"
            >
              <Twitter className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
