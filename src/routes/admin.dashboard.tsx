import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";
import { TrendingUp, Send, PlaneTakeoff, MapPin, Eye, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function StatCard({ title, value, icon: Icon, loading }: any) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#5CA8DF]/10 text-[#5CA8DF]">
          <Icon className="size-6" />
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
        ) : (
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        )}
        <p className="mt-1 text-sm font-medium text-slate-500">{title}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ destinations: 0, requests: 0, whatsappClicks: 0, flightQuotes: 0 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [destRes, reqRes] = await Promise.all([
        supabase.from('destinations').select('id', { count: 'exact', head: true }),
        supabase.from('contact_requests').select('*').order('created_at', { ascending: false }).limit(8),
      ]);

      const allRequests = reqRes.data || [];
      setStats({
        destinations: destRes.count || 0,
        requests: allRequests.length,
        whatsappClicks: allRequests.filter(r => r.type === 'whatsapp').length,
        flightQuotes: allRequests.filter(r => r.type === 'flight_quote').length,
      });
      setRecentRequests(allRequests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `منذ ${diff} ثانية`;
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  }

  function typeLabel(type: string) {
    if (type === 'whatsapp') return 'نقرة واتساب';
    if (type === 'flight_quote') return 'طلب طيران';
    return 'نموذج تواصل';
  }

  function statusBadge(status: string) {
    if (status === 'new') return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">جديد</span>;
    if (status === 'read') return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">مقروء</span>;
    return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">تم الرد</span>;
  }

  return (
    <AdminLayout title="نظرة عامة">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="الوجهات النشطة" value={stats.destinations} icon={MapPin} loading={loading} />
        <StatCard title="نقرات الواتساب" value={stats.whatsappClicks} icon={Send} loading={loading} />
        <StatCard title="طلبات الطيران" value={stats.flightQuotes} icon={PlaneTakeoff} loading={loading} />
        <StatCard title="إجمالي الطلبات" value={stats.requests} icon={Eye} loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">أحدث الطلبات</h2>
            <div className="flex items-center gap-3">
              <button onClick={fetchDashboardData} className="text-slate-400 hover:text-slate-700 transition-colors">
                <RefreshCw className="size-4" />
              </button>
              <button onClick={() => navigate({ to: '/admin/requests' })} className="text-sm font-medium text-[#5CA8DF] hover:underline">عرض الكل</button>
            </div>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />)}
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-sm">لا توجد طلبات بعد</div>
          ) : (
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="py-3 px-6 font-medium">النشاط</th>
                  <th className="py-3 px-6 font-medium">الوجهة</th>
                  <th className="py-3 px-6 font-medium">الوقت</th>
                  <th className="py-3 px-6 font-medium text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium">{typeLabel(req.type)}</td>
                    <td className="py-4 px-6 text-slate-600">{req.destination || req.service || '—'}</td>
                    <td className="py-4 px-6 text-slate-500">{timeAgo(req.created_at)}</td>
                    <td className="py-4 px-6 text-center">{statusBadge(req.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-5">إجراءات سريعة</h2>
          <div className="grid gap-3">
            <button onClick={() => navigate({ to: '/admin/destinations' })} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-[#5CA8DF] hover:bg-blue-50 transition-all text-slate-700 hover:text-blue-700">
              <span className="font-medium">إدارة الوجهات</span>
              <MapPin className="size-5" />
            </button>
            <button onClick={() => navigate({ to: '/admin/settings' })} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-[#5CA8DF] hover:bg-blue-50 transition-all text-slate-700 hover:text-blue-700">
              <span className="font-medium">تحديث رقم الواتساب</span>
              <Send className="size-5" />
            </button>
            <button onClick={() => navigate({ to: '/admin/requests' })} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-[#5CA8DF] hover:bg-blue-50 transition-all text-slate-700 hover:text-blue-700">
              <span className="font-medium">طلبات الطيران</span>
              <PlaneTakeoff className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

