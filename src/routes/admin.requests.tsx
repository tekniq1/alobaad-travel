import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";
import { 
  MessageCircle, 
  RefreshCw, 
  CheckCheck, 
  Eye, 
  Plane, 
  ShieldCheck, 
  Download, 
  Printer, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  X,
  ExternalLink,
  ChevronDown,
  Trash2,
  FileSpreadsheet
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useSiteSettings } from "../hooks/useSiteSettings";

export const Route = createFileRoute("/admin/requests")({
  component: AdminRequests,
});

export function AdminRequests() {
  const { settings } = useSiteSettings();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [departmentFilter, setDepartmentFilter] = useState<'all' | 'tickets' | 'visas'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'replied' | 'cancelled'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  // Details Modal
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const ticketsName = settings.whatsapp_tickets_name || "مسؤول التذاكر";
  const ticketsNum = settings.whatsapp_tickets || "96876652555";
  const visasName = settings.whatsapp_visas_name || "مسؤول التأشيرات";
  const visasNum = settings.whatsapp_visas || "967778383338";

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;

      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteRequest(id: string) {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا الطلب؟")) return;
    try {
      const { error } = await supabase.from('contact_requests').delete().eq('id', id);
      if (error) throw error;
      setRequests(prev => prev.filter(r => r.id !== id));
      if (selectedRequest?.id === id) setSelectedRequest(null);
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  }

  // Identify department helper
  function getDepartment(req: any): 'tickets' | 'visas' {
    const type = (req.type || '').toLowerCase();
    const phone = (req.phone || '').replace(/\D/g, '');
    const service = (req.service || '').toLowerCase();

    if (type === 'tickets' || type === 'flight_quote' || phone.includes('968') || service.includes('طيران') || service.includes('تذكر')) {
      return 'tickets';
    }
    return 'visas';
  }

  // Filter calculations
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const dept = getDepartment(req);

      // Dept filter
      if (departmentFilter !== 'all' && dept !== departmentFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'replied' && (req.status === 'replied' || req.status === 'completed')) {
          // match
        } else if (req.status !== statusFilter) {
          return false;
        }
      }

      // Date filter
      if (dateFilter !== 'all' && req.created_at) {
        const reqDate = new Date(req.created_at).getTime();
        const now = Date.now();
        if (dateFilter === 'today') {
          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);
          if (reqDate < startOfToday.getTime()) return false;
        } else if (dateFilter === 'week') {
          const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
          if (reqDate < weekAgo) return false;
        } else if (dateFilter === 'month') {
          const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
          if (reqDate < monthAgo) return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchFields = [
          req.destination,
          req.service,
          req.message,
          req.name,
          req.phone,
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchFields.includes(q)) return false;
      }

      return true;
    });
  }, [requests, departmentFilter, statusFilter, dateFilter, searchQuery]);

  // Statistics
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

  // Export to Excel / CSV
  function exportCSV() {
    if (filteredRequests.length === 0) {
      alert("لا توجد طلبات لتصديرها");
      return;
    }

    const headers = ["الرقم التعريفي", "القسم", "الموظف المسند إليه", "الرقم المحول", "الخدمة / المعاملة", "الوجهة / المسار", "الحالة", "تاريخ ووقت الطلب", "نص الرسالة"];
    
    const rows = filteredRequests.map(r => {
      const dept = getDepartment(r);
      const deptName = dept === 'tickets' ? 'قسم التذاكر' : 'قسم التأشيرات والموافقات';
      const emp = dept === 'tickets' ? ticketsName : visasName;
      const ph = dept === 'tickets' ? ticketsNum : visasNum;
      const statusText = r.status === 'new' ? 'جديد' : (r.status === 'in_progress' ? 'قيد المتابعة' : (r.status === 'replied' ? 'تم الرد' : 'ملغي'));
      const dateText = r.created_at ? new Date(r.created_at).toLocaleString('ar-YE') : '';

      return [
        r.id || '',
        deptName,
        emp,
        ph,
        `"${(r.service || '').replace(/"/g, '""')}"`,
        `"${(r.destination || '').replace(/"/g, '""')}"`,
        statusText,
        `"${dateText}"`,
        `"${(r.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `تقرير_طلبات_العباد_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handlePrint() {
    window.print();
  }

  function formatDateTime(str: string) {
    if (!str) return '—';
    try {
      const d = new Date(str);
      return d.toLocaleDateString('ar-YE', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return str;
    }
  }

  return (
    <AdminLayout title="إشراف وتتبع طلبات الواتساب">
      {/* Print-only Header */}
      <div className="hidden print:block mb-6 text-center border-b pb-4">
        <h1 className="text-2xl font-bold">وكالة العباد للسفريات والسياحة</h1>
        <p className="text-sm text-slate-600">تقرير رقابة وتتبع طلبات الواتساب والموظفين</p>
        <p className="text-xs text-slate-500 mt-1">تاريخ استخراج التقرير: {new Date().toLocaleString('ar-YE')}</p>
      </div>

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-800">مركز الرقابة والمتابعة</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            تتبع طلبات العملاء المحولة للواتساب لكل موظف ورقم مستقل.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchRequests}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            تحديث
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm hover:bg-emerald-100 transition-colors"
          >
            <FileSpreadsheet className="size-4 text-emerald-600" />
            تصدير كشف Excel
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Printer className="size-4 text-slate-600" />
            طباعة تقرير
          </button>
        </div>
      </div>

      {/* Supervisor KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        
        {/* Officer 1: Tickets */}
        <div 
          onClick={() => setDepartmentFilter(departmentFilter === 'tickets' ? 'all' : 'tickets')}
          className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${departmentFilter === 'tickets' ? 'border-[#0F2A48] bg-sky-50/60 ring-2 ring-[#0F2A48]/20' : 'border-sky-100 bg-white'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#0F2A48] text-white shadow-sm">
              <Plane className="size-5" />
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full">
              قسم التذاكر
            </span>
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-bold text-slate-800">{ticketsName}</h3>
            <p className="text-xs font-mono text-slate-500 dir-ltr" dir="ltr">+{ticketsNum}</p>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
            <div>
              <p className="text-xs text-slate-500">إجمالي الطلبات</p>
              <p className="text-2xl font-black text-[#0F2A48]">{stats.ticketsTotal}</p>
            </div>
            <div className="text-start">
              <span className="text-xs font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md">
                {stats.ticketsToday} طلب اليوم
              </span>
            </div>
          </div>
        </div>

        {/* Officer 2: Visas & Security */}
        <div 
          onClick={() => setDepartmentFilter(departmentFilter === 'visas' ? 'all' : 'visas')}
          className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${departmentFilter === 'visas' ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20' : 'border-emerald-100 bg-white'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <ShieldCheck className="size-5" />
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              التأشيرات والموافقات
            </span>
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-bold text-slate-800">{visasName}</h3>
            <p className="text-xs font-mono text-slate-500 dir-ltr" dir="ltr">+{visasNum}</p>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
            <div>
              <p className="text-xs text-slate-500">إجمالي الطلبات</p>
              <p className="text-2xl font-black text-emerald-700">{stats.visasTotal}</p>
            </div>
            <div className="text-start">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                {stats.visasToday} طلب اليوم
              </span>
            </div>
          </div>
        </div>

        {/* Department Ratio & Total */}
        <div className="sm:col-span-2 lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">مقارنة النشاط بين القسمين</span>
              <span className="text-xs font-bold text-slate-700">المجموع: {stats.total}</span>
            </div>

            {/* Ratio Progress Bar */}
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100 flex">
              <div 
                style={{ width: `${stats.ticketsPct}%` }} 
                className="bg-[#0F2A48] transition-all duration-500" 
                title={`التذاكر: ${stats.ticketsPct}%`}
              />
              <div 
                style={{ width: `${stats.visasPct}%` }} 
                className="bg-emerald-500 transition-all duration-500" 
                title={`التأشيرات: ${stats.visasPct}%`}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="size-2.5 rounded-full bg-[#0F2A48]" />
                التذاكر: {stats.ticketsPct}% ({stats.ticketsTotal})
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                التأشيرات: {stats.visasPct}% ({stats.visasTotal})
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>كل طلب يمثل عميلاً تم تحويله للواتساب مباشرة.</span>
          </div>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-6 print:hidden">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Department Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setDepartmentFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${departmentFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              الكل ({requests.length})
            </button>

            <button
              onClick={() => setDepartmentFilter('tickets')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${departmentFilter === 'tickets' ? 'bg-[#0F2A48] text-white shadow-sm' : 'bg-sky-50 text-sky-800 hover:bg-sky-100'}`}
            >
              <Plane className="size-3.5" />
              تذاكر [{ticketsName}] ({stats.ticketsTotal})
            </button>

            <button
              onClick={() => setDepartmentFilter('visas')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${departmentFilter === 'visas' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
            >
              <ShieldCheck className="size-3.5" />
              تأشيرات [{visasName}] ({stats.visasTotal})
            </button>
          </div>

          {/* Sub Filters: Date & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-primary"
            >
              <option value="all">كل الحالات</option>
              <option value="new">🟡 جديد</option>
              <option value="in_progress">🔵 قيد المتابعة</option>
              <option value="replied">🟢 تم الإنجاز</option>
              <option value="cancelled">🔴 ملغي</option>
            </select>

            {/* Date filter dropdown */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-primary"
            >
              <option value="all">كل الفترات</option>
              <option value="today">اليوم</option>
              <option value="week">آخر 7 أيام</option>
              <option value="month">هذا الشهر</option>
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث بالوجهة، الخدمة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-9 pl-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-primary"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Requests Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
              <MessageCircle className="size-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">لا توجد طلبات مطابقة</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              لم يتم العثور على طلبات بحسب الفلاتر المحددة حالياً. ستظهر الطلبات تلقائياً فور تحويل العميل للواتساب.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">القسم والموظف</th>
                  <th className="py-3.5 px-5">الخدمة / المعاملة</th>
                  <th className="py-3.5 px-5">الوجهة أو المسار</th>
                  <th className="py-3.5 px-5">التاريخ والوقت</th>
                  <th className="py-3.5 px-5 text-center">الحالة</th>
                  <th className="py-3.5 px-5 text-center print:hidden">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(req => {
                  const dept = getDepartment(req);
                  const isTickets = dept === 'tickets';
                  const assignedName = isTickets ? ticketsName : visasName;
                  const assignedPhone = isTickets ? ticketsNum : visasNum;

                  return (
                    <tr 
                      key={req.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${req.status === 'new' ? 'bg-amber-50/30' : ''}`}
                    >
                      {/* Department & Officer */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${isTickets ? 'bg-[#0F2A48]' : 'bg-emerald-600'}`}>
                            {isTickets ? <Plane className="size-4" /> : <ShieldCheck className="size-4" />}
                          </div>
                          <div>
                            <span className={`inline-block text-[11px] font-bold px-1.5 py-0.5 rounded ${isTickets ? 'bg-sky-100 text-sky-900' : 'bg-emerald-100 text-emerald-900'}`}>
                              {isTickets ? 'تذاكر طيران' : 'تأشيرات وموافقات'}
                            </span>
                            <p className="text-xs font-semibold text-slate-800 mt-0.5">
                              {assignedName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service / Subject */}
                      <td className="py-4 px-5">
                        <p className="font-semibold text-slate-900 line-clamp-1">
                          {req.service || (isTickets ? 'طلب حجز طيران' : 'طلب تأشيرة/موافقة')}
                        </p>
                        {req.message && (
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-mono">
                            {req.message.slice(0, 75)}...
                          </p>
                        )}
                      </td>

                      {/* Destination / Route */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {req.destination || 'عام'}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="py-4 px-5 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono">
                          <Clock className="size-3 text-slate-400" />
                          {formatDateTime(req.created_at)}
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-5 text-center">
                        <select
                          value={req.status || 'new'}
                          disabled={updatingId === req.id}
                          onChange={(e) => updateStatus(req.id, e.target.value)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold border cursor-pointer focus:outline-none transition-colors ${
                            req.status === 'new' 
                              ? 'bg-amber-50 text-amber-800 border-amber-200' 
                              : req.status === 'in_progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : req.status === 'replied' || req.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <option value="new">🟡 جديد</option>
                          <option value="in_progress">🔵 قيد المتابعة</option>
                          <option value="replied">🟢 تم الإنجاز</option>
                          <option value="cancelled">🔴 ملغي</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedRequest(req)}
                            title="عرض التفاصيل كاملة"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Eye className="size-4" />
                          </button>

                          {/* Quick WhatsApp Link to Assigned Number */}
                          <a
                            href={`https://wa.me/${assignedPhone}?text=${encodeURIComponent(`بخصوص الطلب رقم: ${req.id ? req.id.slice(0, 8) : ''} - ${req.service || ''}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            title={`محادثة مع ${assignedName} (${assignedPhone})`}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <MessageCircle className="size-4" />
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => deleteRequest(req.id)}
                            title="حذف الطلب"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-xl text-white shadow-sm ${getDepartment(selectedRequest) === 'tickets' ? 'bg-[#0F2A48]' : 'bg-emerald-600'}`}>
                  {getDepartment(selectedRequest) === 'tickets' ? <Plane className="size-5" /> : <ShieldCheck className="size-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    تفاصيل الطلب: {selectedRequest.service || 'استفسار واتساب'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    المعرف: {selectedRequest.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-5 space-y-4 text-sm">
              {/* Row 1: Assigned Officer & Phone */}
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5">
                <div>
                  <span className="text-xs text-slate-500 block">الموظف المسند إليه:</span>
                  <span className="font-bold text-slate-800">
                    {getDepartment(selectedRequest) === 'tickets' ? ticketsName : visasName}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">الرقم المحول إليه:</span>
                  <span className="font-mono font-semibold text-slate-800 dir-ltr block text-start">
                    +{getDepartment(selectedRequest) === 'tickets' ? ticketsNum : visasNum}
                  </span>
                </div>
              </div>

              {/* Row 2: Destination & Time */}
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5">
                <div>
                  <span className="text-xs text-slate-500 block">الوجهة أو المسار:</span>
                  <span className="font-bold text-slate-800">
                    {selectedRequest.destination || 'غير محدد'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">وقت التحويل:</span>
                  <span className="font-mono text-xs text-slate-700">
                    {formatDateTime(selectedRequest.created_at)}
                  </span>
                </div>
              </div>

              {/* Full Message Text */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  نص الرسالة التي أُرسلت للواتساب:
                </span>
                <div className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 leading-relaxed">
                  {selectedRequest.message || 'لا توجد تفاصيل نصية مسجلة.'}
                </div>
              </div>

              {/* Status Update in Modal */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">تحديث الحالة:</span>
                  <select
                    value={selectedRequest.status || 'new'}
                    onChange={(e) => updateStatus(selectedRequest.id, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary"
                  >
                    <option value="new">🟡 جديد</option>
                    <option value="in_progress">🔵 قيد المتابعة</option>
                    <option value="replied">🟢 تم الإنجاز</option>
                    <option value="cancelled">🔴 ملغي</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${getDepartment(selectedRequest) === 'tickets' ? ticketsNum : visasNum}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <MessageCircle className="size-4" />
                    محادثة واتساب
                  </a>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}
