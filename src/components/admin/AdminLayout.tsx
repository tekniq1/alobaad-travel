import { Link, useRouter } from "@tanstack/react-router";
import { 
  LayoutDashboard, 
  Map, 
  Plane, 
  Settings, 
  LogOut, 
  Globe,
  MessageCircle,
  Menu,
  X,
  Bell
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRtl = i18n.dir() === "rtl";

  const navItems = [
    { label: "الرئيسية", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "الوجهات السياحية", icon: Map, href: "/admin/destinations" },
    { label: "الرحلات والطيران", icon: Plane, href: "/admin/flights" },
    { label: "طلبات التواصل", icon: MessageCircle, href: "/admin/requests" },
    { label: "إعدادات الموقع", icon: Settings, href: "/admin/settings" },
  ];

  const handleLogout = () => {
    // Navigate back to login
    router.navigate({ to: "/admin/login" });
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#0F1F2C] text-white">
      {/* Brand */}
      <div className="flex h-20 shrink-0 items-center justify-center border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-3">
          <Globe className="size-6 text-[#5CA8DF]" />
          <span className="text-lg font-bold">العباد للإدارة</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="grid gap-2">
          {navItems.map((item) => {
            const isActive = router.state.location.pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  to={item.href as any}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-[#5CA8DF] text-[#0F1F2C]" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="size-5 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-white/10 p-4 shrink-0">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="size-5 shrink-0" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block border-l border-slate-200">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={`fixed top-0 bottom-0 z-50 w-72 ${isRtl ? 'right-0' : 'left-0'} lg:hidden`}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex w-full flex-col overflow-hidden">
        
        {/* Topbar */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="size-6 text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <Bell className="size-5" />
              <span className="absolute top-1.5 right-2 size-2 rounded-full bg-red-500" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-800">المدير العام</span>
                <span className="text-xs text-slate-500">admin@alobaad.com</span>
              </div>
              <div className="flex size-10 items-center justify-center rounded-full bg-[#0F1F2C] text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
