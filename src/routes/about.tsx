import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "../components/AboutSection";
import i18n from "../lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `${i18n.t("nav.about")} | ${i18n.t("meta.rootTitle")}` },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-[70vh] bg-background text-foreground flex flex-col justify-center py-10">
      <AboutSection />
    </main>
  );
}
