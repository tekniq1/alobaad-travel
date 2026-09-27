import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Globe, ShieldCheck, Target } from "lucide-react";

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="relative overflow-hidden bg-background px-5 py-20 sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Globe className="mr-2 size-4" /> {t("about.tag")}
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {t("about.title")}
            </h2>
            <p className="mb-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("about.desc1")}
            </p>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("about.desc2")}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl border border-border/50 bg-white/50 p-6 shadow-sm backdrop-blur-xl transition-all hover:border-primary/20 hover:shadow-md"
            >
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Target className="size-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{t("about.vision_title")}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t("about.vision_desc")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative overflow-hidden rounded-3xl border border-border/50 bg-white/50 p-6 shadow-sm backdrop-blur-xl transition-all hover:border-primary/20 hover:shadow-md sm:-mt-8"
            >
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{t("about.mission_title")}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t("about.mission_desc")}</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
