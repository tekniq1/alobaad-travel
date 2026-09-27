import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useRouter } from "@tanstack/react-router";

const navItems = [
  ["nav.home", "/"],
  ["nav.destinations", "/#destinations"],
  ["nav.flights", "/#flights"],
  ["nav.about", "/about"],
  ["nav.contact", "/contact"],
];

function BrandLogo() {
  const { t } = useTranslation();
  return (
    <Link to="/" className="flex items-center h-full z-50 transition-transform duration-300 hover:scale-105" aria-label={t("meta.rootTitle")}>
      <img 
        src="/logo-high-res.png" 
        alt={t("meta.rootTitle")}
        className="h-14 sm:h-16 lg:h-20 w-auto object-contain drop-shadow-md py-1"
      />
    </Link>
  );
}

export function SiteHeader() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (window.location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.navigate({ to: "/" }).then(() => {
          setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
        });
      }
    } else {
      router.navigate({ to: href as any });
    }
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/90 shadow-sm backdrop-blur-lg" : "bg-transparent pt-4"}`}>
      <div className="mx-auto flex h-20 lg:h-24 max-w-7xl items-center justify-between px-5 sm:px-8 xl:px-12">
        <BrandLogo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label={t("nav.mainNav")}>
          {navItems.map(([key, href]) => (
            <button key={href} onClick={() => handleNavClick(href)} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">{t(key)}</button>
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
          <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-border bg-white px-5 py-4 shadow-xl lg:hidden overflow-hidden">
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { toggleLanguage(); setOpen(false); }} 
                className="rounded-xl px-4 py-3 text-start text-base font-medium text-foreground hover:bg-muted"
              >
                {i18n.language === "ar" ? "English" : "عربي"}
              </button>
              {navItems.map(([key, href]) => (
                <button key={href} onClick={() => handleNavClick(href)} className="rounded-xl px-4 py-3 text-start text-base font-medium text-foreground hover:bg-muted">{t(key)}</button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
