import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useRouter } from "@tanstack/react-router";

const navItems = [
  { key: "nav.home", href: "/", isHash: false },
  { key: "nav.destinations", href: "/#destinations", isHash: true, targetId: "destinations" },
  { key: "nav.flights", href: "/#flights", isHash: true, targetId: "flights" },
  { key: "nav.about", href: "/about", isHash: false },
  { key: "nav.contact", href: "/contact", isHash: false },
];

function BrandLogo() {
  const { t } = useTranslation();
  return (
    <Link to="/" preload="intent" className="flex items-center h-full z-50 transition-transform duration-200 hover:scale-105 active:scale-95" aria-label={t("meta.rootTitle")}>
      <img 
        src="/logo-high-res.png" 
        alt={t("meta.rootTitle")}
        width="160"
        height="64"
        fetchPriority="high"
        decoding="async"
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
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const scrollToHash = (id: string) => {
    setOpen(false);
    if (window.location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      });
    }
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent pt-3"}`}>
      <div className="mx-auto flex h-20 lg:h-24 max-w-7xl items-center justify-between px-5 sm:px-8 xl:px-12">
        <BrandLogo />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label={t("nav.mainNav")}>
          {navItems.map((item) => (
            item.isHash ? (
              <button
                key={item.href}
                type="button"
                onClick={() => scrollToHash(item.targetId!)}
                className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary cursor-pointer touch-manipulation"
              >
                {t(item.key)}
              </button>
            ) : (
              <Link
                key={item.href}
                to={item.href as any}
                preload="intent"
                activeProps={{ className: "text-primary font-bold" }}
                className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary touch-manipulation"
              >
                {t(item.key)}
              </Link>
            )
          ))}
        </nav>

        {/* Language & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={toggleLanguage} 
            className="text-xs sm:text-sm font-bold text-foreground/80 transition-colors hover:text-primary px-3 py-1.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 cursor-pointer touch-manipulation"
            aria-label="Toggle language"
          >
            {i18n.language === "ar" ? "English" : "عربي"}
          </button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-foreground touch-manipulation" 
            onClick={() => setOpen(!open)} 
            aria-label={t("nav.menu")}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }} 
            transition={{ duration: 0.18 }}
            className="border-t border-border bg-white px-5 py-4 shadow-xl lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                item.isHash ? (
                  <button 
                    key={item.href} 
                    type="button"
                    onClick={() => scrollToHash(item.targetId!)} 
                    className="rounded-xl px-4 py-3 text-start text-base font-semibold text-foreground hover:bg-slate-50 active:bg-slate-100 touch-manipulation"
                  >
                    {t(item.key)}
                  </button>
                ) : (
                  <Link 
                    key={item.href} 
                    to={item.href as any}
                    preload="intent"
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "bg-primary/10 text-primary font-bold" }}
                    className="rounded-xl px-4 py-3 text-start text-base font-semibold text-foreground hover:bg-slate-50 active:bg-slate-100 touch-manipulation block"
                  >
                    {t(item.key)}
                  </Link>
                )
              ))}

              <div className="pt-2 mt-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => { toggleLanguage(); setOpen(false); }} 
                  className="w-full rounded-xl px-4 py-3 text-start text-sm font-bold text-primary hover:bg-primary/5 active:bg-primary/10 touch-manipulation"
                >
                  🌐 {i18n.language === "ar" ? "English" : "العربية"}
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
