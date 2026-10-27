import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";
import { 
  TrendingUp, 
  Send, 
  PlaneTakeoff, 
  MapPin, 
  Eye, 
  RefreshCw, 
  Plane, 
  ShieldCheck, 
  ArrowLeft,
  Clock,
  ExternalLink
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useSiteSettings } from "../hooks/useSiteSettings";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

export function AdminDashboard() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [destCount, setDestCount] = useState(0);

  const ticketsName = settings.whatsapp_tickets_name || "مسؤول التذاكر";
  const ticketsNum = settings.whatsapp_tickets || "96876652555";
  const visasName = settings.whatsapp_visas_name || "مسؤول التأشيرات";
  const visasNum = settings.whatsapp_visas || "967778383338";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [destRes, reqRes] = await Promise.all([
        supabase.from('destinations').select('id', { count: 'exact', head: true }),
        supabase.from('contact_requests').select('*').order('created_at', { ascending: false }).limit(20),
      ]);

      setDestCount(destRes.count || 0);
      setRequests(reqRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getDepartment(req: any): 'tickets' | 'visas' {
    const type = (req.type || '').toLowerCase();
    const phone = (req.phone || '').replace(/\D/g, '');
    const service = (req.service || '').toLowerCase();

    if (type === 'tickets' || type === 'flight_quote' || phone.includes('968') || service.includes('طيران') || service.includes('تذكر')) {
      return 'tickets';
    }
    return 'visas';
  }

  // Supervisor Analytics
  const stats = useMemo(() => {
    let ticketsTotal = 0;
    let ticketsToday = 0;
    let visasTotal = 0;
    let visasToday = 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTs = startOfToday.getTime();

    requests.forEach(r => {
      const dept = getDepartment(r);
      const isToday = r.created_at && new Date(r.created_at).getTime() >= todayTs;

      if (dept === 'tickets') {
        ticketsTotal++;
        if (isToday) ticketsToday++;
      } else {
        visasTotal++;
        if (isToday) visasToday++;
      }
    });

    const total = requests.length;
    const ticketsPct = total > 0 ? Math.round((ticketsTotal / total) * 100) : 50;
    const visasPct = total > 0 ? Math.round((visasTotal / total) * 100) : 50;

    return {
      total,
      ticketsTotal,
      ticketsToday,
      ticketsPct,
      visasTotal,
      visasToday,
      visasPct
    };
  }, [requests]);

  function timeAgo(dateStr: string) {
    if (!dateStr) return '—';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `منذ ثوانٍ`;
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  }

  function statusBadge(status: string) {
    if (status === 'new') return <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">جديد</span>;
    if (status === 'in_progress') return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">قيد المتابعة</span>;
    if (status === 'replied' || status === 'completed') return <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">تم الإنجاز</span>;
    return <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">ملغي</span>;
  }

  return (
    <AdminLayout title="لوحة القيادة والإشراف">
      {/* Supervisor Top Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        
        {/* Card 1: Tickets Officer */}
        <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#0F2A48] text-white">
              <Plane className="size-6" />
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full">
              قسم التذاكر
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">{stats.ticketsTotal}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{ticketsName}</p>
            <p className="text-[11px] font-mono text-slate-400 dir-ltr text-start mt-0.5" dir="ltr">+{ticketsNum}</p>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">اليوم:</span>
            <span className="font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">{stats.ticketsToday} طلب</span>
          </div>
        </div>

        {/* Card 2: Visas Officer */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShieldCheck className="size-6" />
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              التأشيرات والموافقات
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">{stats.visasTotal}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{visasName}</p>
            <p className="text-[11px] font-mono text-slate-400 dir-ltr text-start mt-0.5" dir="ltr">+{visasNum}</p>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">اليوم:</span>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{stats.visasToday} طلب</span>
          </div>
        </div>

        {/* Card 3: Total Requests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Eye className="size-6" />
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              المجموع
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">إجمالي طلبات الواتساب</p>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">مجموع اليوم:</span>
            <span className="font-bold text-primary">{stats.ticketsToday + stats.visasToday} طلب</span>
          </div>
        </div>

        {/* Card 4: Active Destinations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <MapPin className="size-6" />
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
              الوجهات
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">{destCount}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">الوجهات المعروضة بالموقع</p>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
            <button 
              onClick={() => navigate({ to: '/admin/destinations' })}
              className="text-[#5CA8DF] hover:underline font-bold"
            >
              إدارة الوجهات &larr;
            </button>
          </div>
        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Requests Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">أحدث الطلبات المحولة للواتساب</h2>
              <p className="text-xs text-slate-500 mt-0.5">متابعة فورية للطلبات الواردة للموظفين</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchDashboardData} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
                <RefreshCw className="size-4" />
              </button>
              <button 
                onClick={() => navigate({ to: '/admin/requests' })} 
                className="text-xs font-bold text-[#5CA8DF] hover:underline flex items-center gap-1"
              >
                مركز الرقابة الكامل &larr;
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">لا توجد طلبات مسجلة بعد</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                  <tr>
                    <th className="py-3 px-5">القسم والموظف</th>
                    <th className="py-3 px-5">الخدمة</th>
                    <th className="py-3 px-5">الوقت</th>
                    <th className="py-3 px-5 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {requests.slice(0, 7).map(req => {
                    const dept = getDepartment(req);
                    const isTickets = dept === 'tickets';
                    const empName = isTickets ? ticketsName : visasName;

                    return (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex size-6 shrink-0 items-center justify-center rounded-md text-white text-[10px] ${isTickets ? 'bg-[#0F2A48]' : 'bg-emerald-600'}`}>
                              {isTickets ? '✈️' : '📄'}
                            </span>
                            <span className="font-semibold text-xs text-slate-800">{empName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <p className="font-medium text-xs text-slate-900 line-clamp-1">{req.service || req.destination || 'استفسار واتساب'}</p>
                          <p className="text-[11px] text-slate-400">{req.destination || 'عام'}</p>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-slate-500 whitespace-nowrap">
                          {timeAgo(req.created_at)}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          {statusBadge(req.status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Supervision Tools & Navigation */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">التحكم والإشراف</h2>
            <p className="text-xs text-slate-500 mb-5">روابط سريعة لمراقبة وإدارة النظام</p>

            <div className="grid gap-3">
              <button 
                onClick={() => navigate({ to: '/admin/requests' })} 
                className="flex w-full items-center justify-between rounded-xl border border-sky-200 bg-sky-50/70 p-4 hover:border-sky-400 hover:bg-sky-100 transition-all text-sky-950 text-start group"
              >
                <div>
                  <span className="font-bold text-sm block">مركز تتبع الطلبات والمشرف</span>
                  <span className="text-xs text-sky-700">تصدير إكسل، فلترة الأقسام، والمتابعة</span>
                </div>
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </button>

              <button 
                onClick={() => navigate({ to: '/admin/settings' })} 
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-[#5CA8DF] hover:bg-blue-50 transition-all text-slate-700 hover:text-blue-700 text-start group"
              >
                <div>
                  <span className="font-bold text-sm block">إدارة أرقام وموظفي الواتساب</span>
                  <span className="text-xs text-slate-500">تعديل أرقام التذاكر والتأشيرات وأسمائهم</span>
                </div>
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </button>

              <button 
                onClick={() => navigate({ to: '/admin/destinations' })} 
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-[#5CA8DF] hover:bg-blue-50 transition-all text-slate-700 hover:text-blue-700 text-start group"
              >
                <div>
                  <span className="font-bold text-sm block">إدارة الوجهات والخدمات</span>
                  <span className="text-xs text-slate-500">إضافة وتعديل باقات التأشيرات والموافقات</span>
                </div>
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">💡 نصيحة إدارية:</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              يمكنك تصدير كشف كامل بالطلبات عبر زر Excel في صفحة تتبع الطلبات لتقييم حجم العمل الأسبوعي لكل موظف.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
