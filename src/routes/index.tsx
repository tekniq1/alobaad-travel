import { createFileRoute } from "@tanstack/react-router";
import { Menu, X, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";
import logoAsset from "../assets/alobaad-logo.jpg.asset.json";
import { DestinationGrid } from "../components/DestinationGrid";
import { HeroSection } from "../components/HeroSection";
import { QuickActionsBar } from "../components/QuickActionsBar";
import { FlightQuote } from "../components/FlightQuote";
import { WhyAlAbbad } from "../components/WhyAlAbbad";
import { HowItWorks } from "../components/HowItWorks";
import { FinalCTA } from "../components/FinalCTA";
import { SiteFooter } from "../components/SiteFooter";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: i18n.t("meta.indexTitle") },
      { name: "description", content: i18n.t("meta.indexDesc") },
      { property: "og:title", content: i18n.t("meta.rootTitle") },
      { property: "og:description", content: i18n.t("meta.indexOgDesc") },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const navItems = [
  ["nav.home", "#home"],
  ["nav.destinations", "#destinations"],
  ["nav.flights", "#flights"],
  ["nav.about", "#about"],
  ["nav.contact", "#contact"],
];

function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2a9.84 9.84 0 0 0-8.5 14.8L2 22l5.34-1.5A9.98 9.98 0 1 0 12.04 2Zm0 17.98a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.17.9.87-3.1-.2-.32a8 8 0 1 1 6.92 3.83Zm4.45-6.06c-.24-.12-1.44-.7-1.66-.79-.23-.08-.4-.12-.57.13-.16.24-.63.79-.78.95-.14.17-.28.19-.52.07-.24-.12-1.03-.38-1.95-1.2a7.3 7.3 0 0 1-1.35-1.68c-.14-.24-.01-.37.11-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.56-.42h-.48c-.16 0-.43.06-.65.3-.22.24-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.18 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.65-1.16.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function BrandLogo() {
  const { t } = useTranslation();
  return (
    <a href="#home" className="flex items-center h-full z-50 transition-transform duration-300 hover:scale-105" aria-label={t("meta.rootTitle")}>
      <img 
        src="/logo-high-res.png" 
        alt={t("meta.rootTitle")}
        className="h-14 sm:h-16 lg:h-20 w-auto object-contain drop-shadow-md py-1"
      />
    </a>
  );
}

function Header() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/90 shadow-sm backdrop-blur-lg" : "bg-transparent pt-4"}`}>
      <div className="mx-auto flex h-20 lg:h-24 max-w-7xl items-center justify-between px-5 sm:px-8 xl:px-12">
        <BrandLogo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label={t("nav.mainNav")}>
          {navItems.map(([key, href]) => (
            <a key={href} href={href} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">{t(key)}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLanguage} 
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            aria-label="Toggle language"
          >
            {i18n.language === "ar" ? "English" : "عربي"}
          </button>
          <Button variant="ghost" size="icon" className="lg:hidden text-foreground" onClick={() => setOpen(!open)} aria-label={t("nav.menu")}>
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-border bg-white px-5 py-4 shadow-xl lg:hidden">
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { toggleLanguage(); setOpen(false); }} 
                className="rounded-xl px-4 py-3 text-start text-base font-medium text-foreground hover:bg-muted"
              >
                {i18n.language === "ar" ? "English" : "عربي"}
              </button>
              {navItems.map(([key, href]) => (
                <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-muted">{t(key)}</a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Index() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header />

      <HeroSection />
      <QuickActionsBar />

      {/* 2. DESTINATIONS SECTION */}
      <section id="destinations" className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 lg:mb-14"
          >
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">{t("index.chooseDestination")}</h2>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">{t("index.chooseDestinationDesc")}</p>
          </motion.div>
          <DestinationGrid />
        </div>
      </section>

      {/* 3. FLIGHTS SECTION */}
      <FlightQuote />

      {/* 4. HOW IT WORKS */}
      <HowItWorks />

      {/* 5. WHY AL-ABBAD */}
      <WhyAlAbbad />

      {/* 6. FINAL CTA */}
      <FinalCTA />

      {/* 7. FOOTER */}
      <SiteFooter />

      <Button asChild variant="primary" size="icon" className="fixed bottom-6 left-6 z-50 flex size-14 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110 sm:bottom-8 sm:left-8" title={t("index.whatsappDirect")}>
        <a href="https://wa.me/967738883371?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%A7%D9%84%D8%B9%D8%A8%D8%A7%D8%AF" target="_blank" rel="noreferrer" aria-label={t("index.whatsappDirect")}>
          <WhatsAppIcon className="size-6" />
        </a>
      </Button>
    </main>
  );
}