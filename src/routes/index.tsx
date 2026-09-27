import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";
import { DestinationGrid } from "../components/DestinationGrid";
import { HeroSection } from "../components/HeroSection";
import { QuickActionsBar } from "../components/QuickActionsBar";
import { FlightQuote } from "../components/FlightQuote";
import { WhyAlAbbad } from "../components/WhyAlAbbad";
import { HowItWorks } from "../components/HowItWorks";
import { FinalCTA } from "../components/FinalCTA";
import { motion } from "motion/react";

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

function Index() {
  const { t } = useTranslation();
  return (
    <main className="overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
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
    </main>
  );
}