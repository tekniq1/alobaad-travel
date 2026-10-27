import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface SiteSettings {
  id: string;
  whatsapp_number: string;
  whatsapp_tickets: string;
  whatsapp_tickets_name: string;
  whatsapp_visas: string;
  whatsapp_visas_name: string;
  email_address: string;
  address_ar: string;
  address_en: string;
  facebook_url: string;
  instagram_url: string;
}

const defaultSettings: SiteSettings = {
  id: "",
  whatsapp_number: "96876652555",
  whatsapp_tickets: "96876652555",
  whatsapp_tickets_name: "مسؤول تذاكر الطيران",
  whatsapp_visas: "967778383338",
  whatsapp_visas_name: "مسؤول التأشيرات والموافقات",
  email_address: "alobadtravel@gmail.com",
  address_ar: "اليمن، إب | عُمان، مسقط",
  address_en: "Yemen, Ibb | Oman, Muscat",
  facebook_url: "",
  instagram_url: "",
};

// Cache so we don't fetch on every component mount
let cache: SiteSettings | null = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (cache) return cache;
    try {
      const local = localStorage.getItem("alobaad_site_settings");
      if (local) return { ...defaultSettings, ...JSON.parse(local) };
    } catch (e) {}
    return defaultSettings;
  });
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data, error }) => {
        let localOverrides: any = {};
        try {
          const stored = localStorage.getItem("alobaad_site_settings");
          if (stored) localOverrides = JSON.parse(stored);
        } catch (e) {}

        if (!error && data) {
          const merged: SiteSettings = {
            ...defaultSettings,
            ...data,
            ...localOverrides,
            whatsapp_tickets: (data as any).whatsapp_tickets || localOverrides.whatsapp_tickets || data.whatsapp_number || defaultSettings.whatsapp_tickets,
            whatsapp_tickets_name: (data as any).whatsapp_tickets_name || localOverrides.whatsapp_tickets_name || defaultSettings.whatsapp_tickets_name,
            whatsapp_visas: (data as any).whatsapp_visas || localOverrides.whatsapp_visas || defaultSettings.whatsapp_visas,
            whatsapp_visas_name: (data as any).whatsapp_visas_name || localOverrides.whatsapp_visas_name || defaultSettings.whatsapp_visas_name,
          };
          cache = merged;
          setSettings(merged);
        }
        setLoading(false);
      });
  }, []);

  return { settings, loading };
}
