import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface SiteSettings {
  id: string;
  whatsapp_number: string;
  email_address: string;
  address_ar: string;
  address_en: string;
  facebook_url: string;
  instagram_url: string;
}

const defaultSettings: SiteSettings = {
  id: "",
  whatsapp_number: "96876652555",
  email_address: "alobadtravel@gmail.com",
  address_ar: "اليمن، إب | عُمان، مسقط",
  address_en: "Yemen, Ibb | Oman, Muscat",
  facebook_url: "",
  instagram_url: "",
};

// Cache so we don't fetch on every component mount
let cache: SiteSettings | null = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cache || defaultSettings);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          cache = data as SiteSettings;
          setSettings(data as SiteSettings);
        }
        setLoading(false);
      });
  }, []);

  return { settings, loading };
}
