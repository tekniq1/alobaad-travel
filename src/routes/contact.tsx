import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "../components/ContactSection";
import i18n from "../lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `${i18n.t("nav.contact")} | ${i18n.t("meta.rootTitle")}` },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="min-h-[70vh] bg-background text-foreground flex flex-col justify-center py-10">
      <ContactSection />
    </main>
  );
}
