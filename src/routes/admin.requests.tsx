import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";
import { 
  MessageCircle, 
  RefreshCw, 
  Eye, 
  Plane, 
  ShieldCheck, 
  Printer, 
  Search, 
  Clock, 
  User, 
  Phone, 
  X,
  Trash2,
  FileSpreadsheet,
  Copy,
  Check,
  PhoneCall
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
  const [copiedText, setCopiedText] = useState(false);

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

    if (type === 'tickets' || type === 'flight_quote' || phone.includes('968') || service.includes('طيران') || service.includes('تذكر') || service.includes('مطار')) {
      return 'tickets';
    }
    return 'visas';
  }

  // Parse Customer Info
  function getCustomerInfo(req: any) {
    const phoneRaw = (req.phone || '').trim();
    const cleanPhone = phoneRaw.replace(/\D/g, '');
    const ticketClean = ticketsNum.replace(/\D/g, '');
    const visaClean = visasNum.replace(/\D/g, '');

    const isDirectOrEmp = !phoneRaw || 
      phoneRaw.includes('مباشر') || 
      cleanPhone === ticketClean || 
      cleanPhone === visaClean;

    // Determine clean customer name
    let custName = (req.name || '').trim();
    if (!custName || custName.startsWith('مسؤول') || custName.includes('المستلم:')) {
      custName = custName.includes('(') ? custName.split('(')[0].trim() : '';
    }
    if (!custName) {
      custName = getDepartment(req) === 'tickets' ? 'عميل حجز طيران' : 'عميل تأشيرات وموافقات';
    }

    return {
      name: custName,
      phone: isDirectOrEmp ? null : phoneRaw,
      isDirect: isDirectOrEmp,
    };
  }

  // Parse structured details from message
  function parseRequestDetails(req: any) {
    const details: Record<string, string> = {};
    if (!req.message) return details;

    const lines = req.message.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        const clean = trimmed.replace(/^[•-]\s*/, '');
        const parts = clean.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(':').trim();
          if (key && value && !key.includes('نص رسالة')) details[key] = value;
        }
      } else if (trimmed.includes(':') && !trimmed.startsWith('http') && !trimmed.startsWith('[') && !trimmed.startsWith('السلام')) {
        const parts = trimmed.split(':');
        if (parts.length >= 2) {
          const key = parts[0].replace(/^[^\w\u0600-\u06FF]+/, '').trim();
          const value = parts.slice(1).join(':').trim();
          if (key && value && key.length < 30) details[key] = value;
        }
      }
    }
    return details;
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

  // Export to Excel / CSV with Customer Info
  function exportCSV() {
    if (filteredRequests.length === 0) {
      alert("لا توجد طلبات لتصديرها");
      return;
    }

    const headers = [
      "الرقم التعريفي", 
      "اسم العميل", 
      "رقم هاتف العميل", 
      "القسم", 
      "الموظف المسند إليه", 
      "رقم الموظف", 
      "الخدمة / المعاملة", 
      "الوجهة / المسار", 
      "الحالة", 
      "تاريخ ووقت الطلب", 
      "نص الرسالة"
    ];
    
    const rows = filteredRequests.map(r => {
      const dept = getDepartment(r);
      const cust = getCustomerInfo(r);
      const deptName = dept === 'tickets' ? 'قسم التذاكر' : 'قسم التأشيرات والموافقات';
      const emp = dept === 'tickets' ? ticketsName : visasName;
      const ph = dept === 'tickets' ? ticketsNum : visasNum;
      const statusText = r.status === 'new' ? 'جديد' : (r.status === 'in_progress' ? 'قيد المتابعة' : (r.status === 'replied' ? 'تم الإنجاز' : 'ملغي'));
      const dateText = r.created_at ? new Date(r.created_at).toLocaleString('ar-YE') : '';

      return [
        r.id || '',
        `"${cust.name.replace(/"/g, '""')}"`,
        `"${(cust.phone || 'تحويل مباشر').replace(/"/g, '""')}"`,
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

  function copyMessage(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  }

  return (
    <AdminLayout title="مركز الرقابة وتتبع طلبات الواتساب">
      {/* Print-only Header */}
      <div className="hidden print:block mb-6 text-center border-b pb-4">
        <h1 className="text-2xl font-bold">وكالة العباد للسفريات والسياحة</h1>
        <p className="text-sm text-slate-600">تقرير رقابة وتتبع طلبات الواتساب وهواتف العملاء</p>
        <p className="text-xs text-slate-500 mt-1">تاريخ استخراج التقرير: {new Date().toLocaleString('ar-YE')}</p>
      </div>

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-800">مركز الرقابة والمتابعة</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            تتبع أرقام هواتف العملاء وتفاصيل طلباتهم (تذاكر، تأشيرات، موافقات أمنية) لكل موظف.
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

            <div className="mt-2.5 flex justify-between text-xs font-semibold">
              <span className="text-[#0F2A48] flex items-center gap-1">
                <span className="inline-block size-2 rounded-full bg-[#0F2A48]" />
                التذاكر ({stats.ticketsPct}%)
              </span>
              <span className="text-emerald-700 flex items-center gap-1">
                <span className="inline-block size-2 rounded-full bg-emerald-500" />
                التأشيرات والموافقات ({stats.visasPct}%)
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500 flex items-center justify-between">
            <span>الفلاتر النشطة:</span>
            <span className="font-bold text-slate-700">
              {filteredRequests.length} من {requests.length} طلب
            </span>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-6 shadow-sm print:hidden">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Department Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setDepartmentFilter('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                departmentFilter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              جميع الأقسام ({requests.length})
            </button>
            <button
              onClick={() => setDepartmentFilter('tickets')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                departmentFilter === 'tickets' ? 'bg-[#0F2A48] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="size-3.5" />
              تذاكر الطيران ({stats.ticketsTotal})
            </button>
            <button
              onClick={() => setDepartmentFilter('visas')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                departmentFilter === 'visas' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="size-3.5" />
              التأشيرات والموافقات ({stats.visasTotal})
            </button>
          </div>

          {/* Status, Date, & Search Inputs */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-primary"
            >
              <option value="all">جميع الحالات</option>
              <option value="new">جديد (بانتظار الرد)</option>
              <option value="in_progress">قيد المتابعة</option>
              <option value="replied">تم الإنجاز</option>
              <option value="cancelled">ملغي</option>
            </select>

            {/* Date Filter */}
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
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث برقم هاتف العميل، الاسم، الوجهة..."
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
              لم يتم العثور على طلبات بحسب الفلاتر المحددة حالياً. ستظهر الطلبات تلقائياً مع أرقام هواتف وتفاصيل العملاء فور طلبهم.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">بيانات العميل (الهاتف والاسم)</th>
                  <th className="py-3.5 px-5">الخدمة والتفاصيل</th>
                  <th className="py-3.5 px-5">الوجهة أو المسار</th>
                  <th className="py-3.5 px-5">القسم والموظف</th>
                  <th className="py-3.5 px-5">التاريخ والوقت</th>
                  <th className="py-3.5 px-5 text-center">الحالة</th>
                  <th className="py-3.5 px-5 text-center print:hidden">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(req => {
                  const dept = getDepartment(req);
                  const isTickets = dept === 'tickets';
                  const cust = getCustomerInfo(req);
                  const assignedName = isTickets ? ticketsName : visasName;
                  const assignedPhone = isTickets ? ticketsNum : visasNum;
                  const parsed = parseRequestDetails(req);

                  return (
                    <tr 
                      key={req.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${req.status === 'new' ? 'bg-amber-50/30' : ''}`}
                    >
                      {/* Customer Name & Phone */}
                      <td className="py-4 px-5">
                        <div className="flex items-start gap-2.5">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 mt-0.5">
                            <User className="size-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">
                              {cust.name}
                            </p>
                            
                            {cust.phone ? (
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md dir-ltr" dir="ltr">
                                  {cust.phone}
                                </span>
                                <a
                                  href={`https://wa.me/${cust.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="محادثة العميل واتساب"
                                  className="text-emerald-600 hover:text-emerald-700 p-1 hover:bg-emerald-50 rounded"
                                >
                                  <MessageCircle className="size-3.5" />
                                </a>
                                <a
                                  href={`tel:${cust.phone}`}
                                  title="اتصال هاتفي بالعميل"
                                  className="text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-100 rounded"
                                >
                                  <PhoneCall className="size-3.5" />
                                </a>
                              </div>
                            ) : (
                              <span className="inline-block text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded mt-1">
                                تحويل مباشر (لم يُدخل هاتفه)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Service / Subject & Key Details */}
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900 line-clamp-1">
                          {req.service || (isTickets ? 'طلب حجز طيران' : 'طلب تأشيرة/موافقة')}
                        </p>
                        
                        {/* Extracted Details Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {parsed['نوع الرحلة'] && (
                            <span className="text-[10px] font-bold text-sky-800 bg-sky-50 border border-sky-200/60 px-1.5 py-0.5 rounded">
                              {parsed['نوع الرحلة']}
                            </span>
                          )}
                          {parsed['عدد المسافرين'] && (
                            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {parsed['عدد المسافرين']}
                            </span>
                          )}
                          {parsed['تاريخ الذهاب'] && (
                            <span className="text-[10px] font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                              📅 {parsed['تاريخ الذهاب']}
                            </span>
                          )}
                          {parsed['حالة الجواز'] && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              🛂 جواز السفر
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Destination / Route */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {req.destination || 'عام'}
                        </span>
                      </td>

                      {/* Department & Officer */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${isTickets ? 'bg-[#0F2A48]' : 'bg-emerald-600'}`}>
                            {isTickets ? <Plane className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                          </div>
                          <div>
                            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${isTickets ? 'bg-sky-100 text-sky-900' : 'bg-emerald-100 text-emerald-900'}`}>
                              {isTickets ? 'تذاكر طيران' : 'تأشيرات وموافقات'}
                            </span>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">
                              {assignedName}
                            </p>
                          </div>
                        </div>
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
                            title="عرض جميع التفاصيل"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Eye className="size-4" />
                          </button>

                          {/* Quick WhatsApp Link to Customer or Employee */}
                          {cust.phone ? (
                            <a
                              href={`https://wa.me/${cust.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`أهلاً بك أخي الكريم من وكالة العباد للسفريات بخصوص طلبكم: ${req.service || ''}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              title={`محادثة العميل (${cust.phone})`}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <MessageCircle className="size-4" />
                            </a>
                          ) : (
                            <a
                              href={`https://wa.me/${assignedPhone}?text=${encodeURIComponent(`بخصوص الطلب رقم: ${req.id ? req.id.slice(0, 8) : ''} - ${req.service || ''}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              title={`محادثة مع الموظف المستلم ${assignedName}`}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <MessageCircle className="size-4" />
                            </a>
                          )}

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

      {/* Comprehensive Request Details Modal */}
      {selectedRequest && (() => {
        const dept = getDepartment(selectedRequest);
        const isTickets = dept === 'tickets';
        const cust = getCustomerInfo(selectedRequest);
        const assignedName = isTickets ? ticketsName : visasName;
        const assignedPhone = isTickets ? ticketsNum : visasNum;
        const parsed = parseRequestDetails(selectedRequest);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 my-8">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex size-11 items-center justify-center rounded-xl text-white shadow-sm ${isTickets ? 'bg-[#0F2A48]' : 'bg-emerald-600'}`}>
                    {isTickets ? <Plane className="size-6" /> : <ShieldCheck className="size-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isTickets ? 'bg-sky-100 text-sky-900' : 'bg-emerald-100 text-emerald-900'}`}>
                        {isTickets ? 'قسم التذاكر' : 'قسم التأشيرات والموافقات'}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {selectedRequest.id ? selectedRequest.id.slice(0, 13) : ''}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      {selectedRequest.service || 'استفسار طلب'}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mt-5 space-y-4 text-sm">
                
                {/* 1. Customer Card */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
                      <User className="size-4" />
                      بيانات العميل (صاحب الطلب)
                    </span>
                    {cust.phone ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        رقم هاتف متوفر
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
                        تحويل مباشر
                      </span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 bg-white rounded-xl p-3.5 border border-emerald-100">
                    <div>
                      <span className="text-xs text-slate-500 block">اسم العميل:</span>
                      <span className="text-sm font-bold text-slate-900">{cust.name}</span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-500 block">رقم هاتف العميل:</span>
                      {cust.phone ? (
                        <span className="font-mono text-sm font-bold text-emerald-700 dir-ltr block text-start" dir="ltr">
                          {cust.phone}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">لم يتم إدخال رقم (مراسلة مباشرة)</span>
                      )}
                    </div>
                  </div>

                  {/* Customer Quick Actions */}
                  {cust.phone && (
                    <div className="mt-3 flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cust.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`أهلاً بك أخي الكريم من وكالة العباد للسفريات والسياحة بخصوص طلبكم: ${selectedRequest.service || ''}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
                      >
                        <MessageCircle className="size-4" />
                        <span>محادثة العميل واتساب مباشرة</span>
                      </a>

                      <a
                        href={`tel:${cust.phone}`}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors"
                      >
                        <PhoneCall className="size-4 text-emerald-600" />
                        <span>اتصال</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* 2. Structured Request Details */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-3">
                    <Plane className="size-4 text-primary" />
                    تفاصيل المعاملة والخدمة
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="bg-white rounded-xl p-3 border border-slate-100">
                      <span className="text-[11px] text-slate-500 block">الوجهة أو المسار:</span>
                      <span className="text-xs font-bold text-slate-900">{selectedRequest.destination || 'غير محدد'}</span>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-slate-100">
                      <span className="text-[11px] text-slate-500 block">تاريخ الطلب:</span>
                      <span className="text-xs font-mono text-slate-800">{formatDateTime(selectedRequest.created_at)}</span>
                    </div>

                    {Object.entries(parsed).map(([key, val]) => {
                      if (key.includes('اسم') || key.includes('هاتف') || key.includes('الموظف') || key.includes('القسم')) return null;
                      return (
                        <div key={key} className="bg-white rounded-xl p-3 border border-slate-100">
                          <span className="text-[11px] text-slate-500 block">{key}:</span>
                          <span className="text-xs font-bold text-slate-900">{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Assigned Staff Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="size-4 text-sky-700" />
                    الموظف المسؤول والقسم المسند إليه
                  </span>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <div>
                      <span className="text-xs text-slate-500 block">الموظف المسند إليه:</span>
                      <span className="text-sm font-bold text-slate-800">{assignedName}</span>
                    </div>

                    <div className="text-start">
                      <span className="text-xs text-slate-500 block">الرقم المحول إليه:</span>
                      <span className="font-mono text-xs font-bold text-slate-800 dir-ltr block" dir="ltr">
                        +{assignedPhone}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/${assignedPhone}?text=${encodeURIComponent(`بخصوص الطلب: ${selectedRequest.service || ''} للعميل: ${cust.name} (${cust.phone || ''})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <MessageCircle className="size-3.5 text-emerald-600" />
                      محادثة الموظف
                    </a>
                  </div>
                </div>

                {/* 4. Full WhatsApp Message */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">
                      نص الرسالة المرسلة للواتساب بالكامل:
                    </span>
                    <button
                      onClick={() => copyMessage(selectedRequest.message || '')}
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      {copiedText ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                      {copiedText ? "تم النسخ" : "نسخ النص"}
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs text-slate-800 leading-relaxed">
                    {selectedRequest.message || 'لا توجد تفاصيل نصية إضافية.'}
                  </div>
                </div>

                {/* Status & Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
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

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="w-full sm:w-auto rounded-xl border border-slate-200 px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
      })()}
    </AdminLayout>
  );
}