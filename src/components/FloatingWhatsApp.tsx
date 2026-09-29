import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "../hooks/useSiteSettings";

export function FloatingWhatsApp() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const waNumber = settings.whatsapp_number || "96876652555";
  const waMessage = encodeURIComponent(t("hero.wa_msg"));

  return (
    <Button asChild variant="primary" size="icon" className="fixed bottom-6 left-6 z-50 flex size-14 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110 sm:bottom-8 sm:left-8" title={t("index.whatsappDirect")}>
      <a href={`https://wa.me/${waNumber}?text=${waMessage}`} target="_blank" rel="noreferrer" aria-label={t("index.whatsappDirect")}>
        <WhatsAppIcon className="size-6" />
      </a>
    </Button>
  );
}

