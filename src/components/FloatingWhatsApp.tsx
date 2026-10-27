import { useState, useRef, useEffect } from "react";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { Plane, ShieldCheck, X, MessageSquare, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { logWhatsAppClick, recordWhatsAppRequest } from "../lib/api";
import { getWhatsAppUrl, cleanWhatsAppPhone } from "../lib/utils";

export function FloatingWhatsApp() {
  const { t, i18n } = useTranslation();
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isRtl = i18n.dir() === "rtl";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const ticketsNumber = cleanWhatsAppPhone(settings.whatsapp_tickets, '968');
  const visasNumber = cleanWhatsAppPhone(settings.whatsapp_visas, '967');

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    const handleOpenChannels = () => setIsOpen(true);
    window.addEventListener("openWhatsAppChannels", handleOpenChannels);

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("openWhatsAppChannels", handleOpenChannels);
    };
  }, [isOpen]);

  const handleChannelClick = (type: "tickets" | "visas", number: string, defaultMsg: string) => {
    const employee = type === "tickets" 
      ? (settings.whatsapp_tickets_name || "مسؤول تذاكر الطيران")
      : (settings.whatsapp_visas_name || "مسؤول التأشيرات والموافقات");

    recordWhatsAppRequest({
      department: type,
      phone: number,
      employeeName: employee,
      service: type === "tickets" ? "استفسار تذاكر طيران (عبر الزر العائم)" : "استفسار تأشيرات وموافقات (عبر الزر العائم)",
      message: defaultMsg,
    });
    logWhatsAppClick(`floating_whatsapp_${type}`);
    window.open(getWhatsAppUrl(number, defaultMsg, type === "tickets" ? '968' : '967'), "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 left-6 z-50 sm:bottom-8 sm:left-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 left-0 mb-3 w-[330px] sm:w-[370px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/10 border border-slate-100 dark:bg-slate-900 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
                  <WhatsAppIcon className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {t("whatsapp_channels.title")}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t("whatsapp_channels.subtitle")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Channels List */}
            <div className="mt-3 flex flex-col gap-2.5">
              {/* Channel 1: Visas & Security Approvals */}
              <button
                onClick={() =>
                  handleChannelClick(
                    "visas",
                    visasNumber,
                    t("whatsapp_channels.visas_msg")
                  )
                }
                className="group flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-start transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md hover:shadow-emerald-500/5 active:scale-[0.98] dark:border-emerald-900/40 dark:bg-emerald-950/20"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      {t("whatsapp_channels.visas_title")}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 dir-ltr font-mono bg-emerald-100/70 px-1.5 py-0.5 rounded dark:bg-emerald-900/40 dark:text-emerald-300">
                      +967 778383338
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-1 dark:text-slate-400">
                    {t("whatsapp_channels.visas_desc")}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>{t("whatsapp_channels.chat_now")}</span>
                    <ArrowIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </button>

              {/* Channel 2: Flight Tickets */}
              <button
                onClick={() =>
                  handleChannelClick(
                    "tickets",
                    ticketsNumber,
                    t("whatsapp_channels.tickets_msg")
                  )
                }
                className="group flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-start transition-all hover:border-sky-300 hover:bg-sky-50 hover:shadow-md hover:shadow-sky-500/5 active:scale-[0.98] dark:border-sky-900/40 dark:bg-sky-950/20"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0F2A48] text-white shadow-sm">
                  <Plane className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-950 dark:text-sky-300">
                      {t("whatsapp_channels.tickets_title")}
                    </span>
                    <span className="text-[11px] font-semibold text-sky-800 dir-ltr font-mono bg-sky-100/70 px-1.5 py-0.5 rounded dark:bg-sky-900/40 dark:text-sky-300">
                      +968 76652555
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-1 dark:text-slate-400">
                    {t("whatsapp_channels.tickets_desc")}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                    <span>{t("whatsapp_channels.chat_now")}</span>
                    <ArrowIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] active:scale-95"
        title={t("index.whatsappDirect")}
        aria-label={t("index.whatsappDirect")}
      >
        <span className="absolute -top-1 -right-1 flex size-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-4 rounded-full bg-emerald-600 border-2 border-white"></span>
        </span>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="size-6" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <WhatsAppIcon className="size-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
