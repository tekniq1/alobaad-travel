import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Settings, Save, Phone, Mail, MapPin, Lock, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [settings, setSettings] = useState({
    id: "",
    whatsapp_number: "96876652555",
    whatsapp_tickets: "96876652555",
    whatsapp_tickets_name: "مسؤول تذاكر الطيران",
    whatsapp_visas: "967778383338",
    whatsapp_visas_name: "مسؤول التأشيرات والموافقات",
    email_address: "",
    address_ar: "",
    address_en: ""
  });
  
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
        
      if (error) throw error;
      let localOverrides: any = {};
      try {
        const stored = localStorage.getItem("alobaad_site_settings");
        if (stored) localOverrides = JSON.parse(stored);
      } catch (e) {}

      if (data) {
        setSettings({
          ...data,
          ...localOverrides,
          whatsapp_tickets: (data as any).whatsapp_tickets || localOverrides.whatsapp_tickets || data.whatsapp_number || "96876652555",
          whatsapp_tickets_name: (data as any).whatsapp_tickets_name || localOverrides.whatsapp_tickets_name || "مسؤول تذاكر الطيران",
          whatsapp_visas: (data as any).whatsapp_visas || localOverrides.whatsapp_visas || "967778383338",
          whatsapp_visas_name: (data as any).whatsapp_visas_name || localOverrides.whatsapp_visas_name || "مسؤول التأشيرات والموافقات",
        });
        setAdminEmail(data.admin_email || "admin@alobaad.com");
        setAdminPassword(data.admin_password || "123456");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    
    try {
      localStorage.setItem("alobaad_site_settings", JSON.stringify({
        whatsapp_tickets: settings.whatsapp_tickets,
        whatsapp_tickets_name: settings.whatsapp_tickets_name,
        whatsapp_visas: settings.whatsapp_visas,
        whatsapp_visas_name: settings.whatsapp_visas_name,
      }));

      const payload: any = {
        ...(settings.id ? { id: settings.id } : {}),
        whatsapp_number: settings.whatsapp_tickets || settings.whatsapp_number,
        email_address: settings.email_address,
        address_ar: settings.address_ar,
        address_en: settings.address_en,
        admin_email: adminEmail,
        admin_password: adminPassword,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('site_settings')
        .upsert(payload);
        
      if (error) throw error;
      
      setMessage("✅ تم حفظ الإعدادات بنجاح!");
      // Refresh to get the ID if it was a new insert
      fetchSettings();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      setMessage(`❌ حدث خطأ: ${error?.message || 'تعذر الحفظ'}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 4000);
    }
  }

  return (
    <AdminLayout title="إعدادات الموقع">
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-500">تعديل الإعدادات العامة للموقع مثل أرقام التواصل والعنوان.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-6 bg-slate-50/50">
          <div className="flex items-center gap-3 text-slate-800">
            <Settings className="size-5 text-[#5CA8DF]" />
            <h2 className="text-lg font-bold">معلومات التواصل الأساسية</h2>
          </div>
        </div>
        
        {loading ? (
          <div className="p-10 text-center text-slate-500">جاري تحميل الإعدادات...</div>
        ) : (
          <form onSubmit={handleSave} className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 mb-8">
              
              {/* WhatsApp Visas Number & Name */}
              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Phone className="size-4 text-emerald-500" />
                    رقم واتساب التأشيرات والموافقات الأمنية
                  </span>
                  <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    قسم التأشيرات
                  </span>
                </label>
                <input 
                  type="text" 
                  dir="ltr"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-start font-mono"
                  value={settings.whatsapp_visas || ""}
                  onChange={(e) => setSettings({...settings, whatsapp_visas: e.target.value})}
                  placeholder="967778383338"
                />
                <p className="text-xs text-slate-500">الرقم بالصيغة الدولية بدون + (مثال: 967778383338)</p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700">
                  اسم موظف / مسؤول قسم التأشيرات والموافقات
                </label>
                <input 
                  type="text" 
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  value={settings.whatsapp_visas_name || ""}
                  onChange={(e) => setSettings({...settings, whatsapp_visas_name: e.target.value})}
                  placeholder="مثال: أحمد - مسؤول التأشيرات"
                />
                <p className="text-xs text-slate-500">يظهر هذا الاسم في تقارير المشرف لمتابعة أداء الموظف</p>
              </div>

              {/* WhatsApp Tickets Number & Name */}
              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Phone className="size-4 text-sky-500" />
                    رقم واتساب تذاكر الطيران
                  </span>
                  <span className="text-xs font-normal text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                    قسم التذاكر
                  </span>
                </label>
                <input 
                  type="text" 
                  dir="ltr"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 focus:border-[#5CA8DF] focus:outline-none focus:ring-1 focus:ring-[#5CA8DF]/50 text-start font-mono"
                  value={settings.whatsapp_tickets || ""}
                  onChange={(e) => setSettings({...settings, whatsapp_tickets: e.target.value})}
                  placeholder="96876652555"
                />
                <p className="text-xs text-slate-500">الرقم بالصيغة الدولية بدون + (مثال: 96876652555)</p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700">
                  اسم موظف / مسؤول قسم تذاكر الطيران
                </label>
                <input 
                  type="text" 
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 focus:border-[#5CA8DF] focus:outline-none focus:ring-1 focus:ring-[#5CA8DF]/50"
                  value={settings.whatsapp_tickets_name || ""}
                  onChange={(e) => setSettings({...settings, whatsapp_tickets_name: e.target.value})}
                  placeholder="مثال: محمد - مسؤول التذاكر"
                />
                <p className="text-xs text-slate-500">يظهر هذا الاسم في تقارير المشرف لمتابعة أداء الموظف</p>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail className="size-4 text-slate-400" />
                  البريد الإلكتروني
                </label>
                <input 
                  type="email" 
                  dir="ltr"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 focus:border-[#5CA8DF] focus:outline-none focus:ring-1 focus:ring-[#5CA8DF]/50 text-start"
                  value={settings.email_address || ""}
                  onChange={(e) => setSettings({...settings, email_address: e.target.value})}
                  placeholder="info@alobaad.com"
                />
              </div>

              {/* Address AR */}
              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin className="size-4 text-slate-400" />
                  العنوان (بالعربية)
                </label>
                <input 
                  type="text" 
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 focus:border-[#5CA8DF] focus:outline-none focus:ring-1 focus:ring-[#5CA8DF]/50"
                  value={settings.address_ar || ""}
                  onChange={(e) => setSettings({...settings, address_ar: e.target.value})}
                />
              </div>

              {/* Address EN */}
              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin className="size-4 text-slate-400" />
                  العنوان (بالإنجليزية)
                </label>
                <input 
                  type="text" 
                  dir="ltr"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 focus:border-[#5CA8DF] focus:outline-none focus:ring-1 focus:ring-[#5CA8DF]/50 text-start"
                  value={settings.address_en || ""}
                  onChange={(e) => setSettings({...settings, address_en: e.target.value})}
                />
              </div>

            </div>

            <div className="border-t border-slate-100 pt-8 mt-4 mb-8">
              <div className="flex items-center gap-3 text-slate-800 mb-6">
                <ShieldCheck className="size-5 text-[#5CA8DF]" />
                <h2 className="text-lg font-bold">بيانات تسجيل الدخول (لوحة التحكم)</h2>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Mail className="size-4 text-slate-400" />
                    البريد الإلكتروني للوحة التحكم
                  </label>
                  <input 
                    type="email" 
                    dir="ltr"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 focus:border-[#5CA8DF] focus:outline-none focus:ring-1 focus:ring-[#5CA8DF]/50 text-start"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Lock className="size-4 text-slate-400" />
                    كلمة المرور
                  </label>
                  <input 
                    type="text" 
                    dir="ltr"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 focus:border-[#5CA8DF] focus:outline-none focus:ring-1 focus:ring-[#5CA8DF]/50 text-start"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <span className={`text-sm font-bold ${message.includes('خطأ') ? 'text-red-500' : 'text-green-600'}`}>
                {message}
              </span>
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#0F1F2C] px-6 py-3 text-sm font-bold text-white hover:bg-[#162836] transition-colors disabled:opacity-70"
              >
                {saving ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                حفظ الإعدادات
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
