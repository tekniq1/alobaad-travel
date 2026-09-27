import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isRtl = i18n.dir() === "rtl";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('admin_email, admin_password')
        .limit(1)
        .single();
        
      const savedEmail = data?.admin_email || "admin@alobaad.com";
      const savedPassword = data?.admin_password || "123456";

      if (email === savedEmail && password === savedPassword) {
        router.navigate({ to: "/admin/dashboard" });
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      // Fallback in case of DB error
      if (email === "admin@alobaad.com" && password === "123456") {
        router.navigate({ to: "/admin/dashboard" });
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0F1F2C] overflow-hidden p-5">
      {/* Ambient glowing effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#5CA8DF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#159DD3]/10 blur-[120px] pointer-events-none" />
      
      {/* Back to site button */}
      <button 
        onClick={() => router.navigate({ to: "/" })}
        className="absolute top-6 left-6 lg:top-10 lg:left-10 flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors z-20"
      >
        {isRtl ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
        {t("admin.back_home")}
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
          
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#5CA8DF]/10 border border-[#5CA8DF]/20 text-[#5CA8DF]">
              <ShieldCheck className="size-8" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl tracking-tight">
              {t("admin.login_title")}
            </h1>
            <p className="text-sm text-white/50 leading-relaxed">
              {t("admin.login_subtitle")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="grid gap-5">
            <div className="grid gap-2 text-start">
              <label className="text-sm font-medium text-white/80">{t("admin.email")}</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                required
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus:border-[#5CA8DF] focus:outline-none focus:ring-1 focus:ring-[#5CA8DF]/50 transition-colors text-start" 
                placeholder={t("admin.email_ph")} 
              />
            </div>
            
            <div className="grid gap-2 text-start">
              <label className="text-sm font-medium text-white/80">{t("admin.password")}</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                required
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus:border-[#5CA8DF] focus:outline-none focus:ring-1 focus:ring-[#5CA8DF]/50 transition-colors text-start" 
                placeholder={t("admin.password_ph")} 
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="text-sm font-medium text-red-400 text-center bg-red-400/10 py-2 rounded-lg"
              >
                {t("admin.invalid_creds")}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 h-12 w-full rounded-xl bg-gradient-to-r from-[#5CA8DF] to-[#6CB5E9] text-base font-bold text-[#0F1F2C] shadow-lg shadow-[#5CA8DF]/20 hover:shadow-[#5CA8DF]/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="size-5 border-2 border-[#0F1F2C]/30 border-t-[#0F1F2C] rounded-full animate-spin" />
              ) : (
                t("admin.login_btn")
              )}
            </button>
          </form>
          
        </div>
      </motion.div>
    </div>
  );
}
