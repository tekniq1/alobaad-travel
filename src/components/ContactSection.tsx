import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export function ContactSection() {
  const { t } = useTranslation();

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

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-sm border border-border/50"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone className="size-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">{t("contact.phone_title")}</h3>
                <p className="text-sm text-muted-foreground" dir="ltr">{t("contact.phone_desc")}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-sm border border-border/50"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="size-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">{t("contact.email_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.email_desc")}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button asChild size="lg" className="w-full rounded-2xl bg-[#25D366] hover:bg-[#20b858] text-white">
                <a href="https://wa.me/967738883371" target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-5" />
                  {t("contact.whatsapp_btn")}
                </a>
              </Button>
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
