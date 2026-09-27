import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";
import { MessageCircle, RefreshCw, CheckCheck, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/admin/requests")({
  component: AdminRequests,
});

function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');

  useEffect(() => { fetchRequests(); }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('contact_requests').update({ status }).eq('id', id);
    fetchRequests();
  }

  function timeAgo(dateStr: string) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `منذ ${diff} ثانية`;
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  }

  function typeLabel(type: string) {
    if (type === 'whatsapp') return { label: 'واتساب', color: 'bg-green-100 text-green-800' };
    if (type === 'flight_quote') return { label: 'طيران', color: 'bg-blue-100 text-blue-800' };
    return { label: 'نموذج', color: 'bg-slate-100 text-slate-700' };
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const newCount = requests.filter(r => r.status === 'new').length;

  return (
    <AdminLayout title="طلبات التواصل">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: `الكل (${requests.length})` },
            { key: 'new', label: `جديد (${newCount})` },
            { key: 'read', label: 'مقروء' },
            { key: 'replied', label: 'تم الرد' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${filter === tab.key ? 'bg-[#0F1F2C] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={fetchRequests} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <RefreshCw className="size-4" /> تحديث
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center">
            <MessageCircle className="size-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">لا توجد طلبات</h3>
            <p className="text-sm text-slate-500 mt-1">ستظهر الطلبات هنا عند تسجيلها من الموقع</p>
          </div>
        ) : (
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-5 font-semibold text-slate-600">النوع</th>
                <th className="py-3 px-5 font-semibold text-slate-600">الاسم</th>
                <th className="py-3 px-5 font-semibold text-slate-600">الوجهة / الخدمة</th>
                <th className="py-3 px-5 font-semibold text-slate-600">الهاتف</th>
                <th className="py-3 px-5 font-semibold text-slate-600">الوقت</th>
                <th className="py-3 px-5 font-semibold text-slate-600 text-center">الحالة</th>
                <th className="py-3 px-5 font-semibold text-slate-600 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(req => {
                const t = typeLabel(req.type);
                return (
                  <tr key={req.id} className={`hover:bg-slate-50 transition-colors ${req.status === 'new' ? 'bg-blue-50/40' : ''}`}>
                    <td className="py-3 px-5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${t.color}`}>{t.label}</span>
                    </td>
                    <td className="py-3 px-5 font-medium text-slate-800">{req.name || '—'}</td>
                    <td className="py-3 px-5 text-slate-600">{req.destination || req.service || '—'}</td>
                    <td className="py-3 px-5 text-slate-500 dir-ltr" dir="ltr">{req.phone || '—'}</td>
                    <td className="py-3 px-5 text-slate-500 text-xs">{timeAgo(req.created_at)}</td>
                    <td className="py-3 px-5 text-center">
                      {req.status === 'new' && <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">جديد</span>}
                      {req.status === 'read' && <span className="inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-800">مقروء</span>}
                      {req.status === 'replied' && <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">تم الرد</span>}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {req.status === 'new' && (
                          <button onClick={() => updateStatus(req.id, 'read')} title="تحديد كمقروء" className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="size-4" />
                          </button>
                        )}
                        {req.status !== 'replied' && (
                          <button onClick={() => updateStatus(req.id, 'replied')} title="تحديد كتم الرد" className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <CheckCheck className="size-4" />
                          </button>
                        )}
                        {req.phone && (
                          <a href={`https://wa.me/${req.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="رد على الواتساب" className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors text-sm font-bold">
                            WA
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

