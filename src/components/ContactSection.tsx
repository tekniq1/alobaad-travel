import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { MapPin, Mail, Phone, MessageCircle, ShieldCheck, Plane } from "lucide-react";
import { Button } from "./ui/button";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { recordWhatsAppRequest } from "../lib/api";
import { getWhatsAppUrl, cleanWhatsAppPhone } from "../lib/utils";

export function ContactSection() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const visasNum = cleanWhatsAppPhone(settings.whatsapp_visas, '967');
  const ticketsNum = cleanWhatsAppPhone(settings.whatsapp_tickets, '968');

  return (
    <section id="contact" className="relative overflow-hidden bg-muted/30 px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-12 text-center lg:mb-16">
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {t("contact.tag")}
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("contact.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Contact Details */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-sm border border-border/50"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="size-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">{t("contact.address_title")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("contact.address_desc")}</p>
              </div>
            </motion.div>

            {/* Department 1: Visas & Security Approvals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col gap-3 rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-emerald-100 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-0.5 font-bold text-foreground text-sm sm:text-base">
                    {t("whatsapp_channels.visas_title")}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("whatsapp_channels.visas_desc")}
                  </p>
                  <p className="text-sm font-semibold text-emerald-700 dir-ltr font-mono" dir="ltr">
                    +967 778383338
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="w-full mt-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs">
                <a 
                  href={getWhatsAppUrl(visasNum, t("whatsapp_channels.visas_msg"), '967')}
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => {
                    recordWhatsAppRequest({
                      department: "visas",
                      phone: visasNum,
                      employeeName: settings.whatsapp_visas_name || "مسؤول التأشيرات والموافقات",
                      service: "استفسار تأشيرات (صفحة اتصل بنا)",
                      message: t("whatsapp_channels.visas_msg"),
                    });
                  }}
                >
                  <MessageCircle className="mr-1.5 size-4" />
                  {t("contact.whatsapp_visas_btn")}
                </a>
              </Button>
            </motion.div>

            {/* Department 2: Flight Tickets */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-col gap-3 rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-sky-100 hover:border-sky-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-[#0F2A48]">
                  <Plane className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-0.5 font-bold text-foreground text-sm sm:text-base">
                    {t("whatsapp_channels.tickets_title")}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("whatsapp_channels.tickets_desc")}
                  </p>
                  <p className="text-sm font-semibold text-sky-800 dir-ltr font-mono" dir="ltr">
                    +968 76652555
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="w-full mt-1 rounded-xl bg-[#0F2A48] hover:bg-[#163a63] text-white font-medium text-xs">
                <a 
                  href={getWhatsAppUrl(ticketsNum, t("whatsapp_channels.tickets_msg"), '968')}
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => {
                    recordWhatsAppRequest({
                      department: "tickets",
                      phone: ticketsNum,
                      employeeName: settings.whatsapp_tickets_name || "مسؤول تذاكر الطيران",
                      service: "استفسار تذاكر (صفحة اتصل بنا)",
                      message: t("whatsapp_channels.tickets_msg"),
                    });
                  }}
                >
                  <MessageCircle className="mr-1.5 size-4" />
                  {t("contact.whatsapp_tickets_btn")}
                </a>
              </Button>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-start gap-4 rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-border/50"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Mail className="size-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground text-sm sm:text-base">{t("contact.email_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.email_desc")}</p>
              </div>
            </motion.div>
          </div>

          {/* Luxury Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 relative overflow-hidden rounded-3xl shadow-2xl min-h-[400px] group"
          >
            {/* Background Image */}
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
              <img 
                src="/premium-travel-hero.jpg" 
                alt="Luxury Travel" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Elegant Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F2C] via-[#0F1F2C]/40 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 z-10">
              <div className="mb-4 inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-white border border-white/20 self-start">
                خدمة العملاء VIP
              </div>
              <h3 className="mb-3 text-3xl font-bold text-white sm:text-4xl leading-tight">
                نسعد بخدمتكم في كل وقت
              </h3>
              <p className="text-base text-white/80 max-w-md leading-relaxed">
                في العباد للسفريات، نضع راحتك أولاً. فريقنا المتخصص جاهز دائماً للرد على استفساراتك وتلبية متطلبات سفرك بأعلى معايير الجودة والسرعة.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
