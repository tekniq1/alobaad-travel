import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";
import { ArrowRight, Plus, Edit, Trash2, Plane, ChevronDown, ChevronUp, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/admin/destinations_/$destId/services")({
  component: AdminServices,
});

function AdminServices() {
  const { destId } = Route.useParams();
  const navigate = useNavigate();

  const [dest, setDest] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [airports, setAirports] = useState<Record<string, any[]>>({});

  // Service form state
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState({ title_ar: "", title_en: "", wa_message_ar: "", wa_message_en: "" });
  const [savingService, setSavingService] = useState(false);

  // Airport form state
  const [showAirportForm, setShowAirportForm] = useState<string | null>(null);
  const [editingAirport, setEditingAirport] = useState<any | null>(null);
  const [airportForm, setAirportForm] = useState({ name_ar: "", name_en: "", wa_message_ar: "", wa_message_en: "" });
  const [savingAirport, setSavingAirport] = useState(false);

  useEffect(() => { fetchAll(); }, [destId]);

  async function fetchAll() {
    setLoading(true);
    try {
      const [destRes, servicesRes] = await Promise.all([
        supabase.from('destinations').select('*').eq('id', destId).single(),
        supabase.from('services').select('*').eq('destination_id', destId).order('sort_order'),
      ]);
      setDest(destRes.data);
      setServices(servicesRes.data || []);

      // Fetch airports for all services
      if (servicesRes.data && servicesRes.data.length > 0) {
        const serviceIds = servicesRes.data.map((s: any) => s.id);
        const { data: airportsData } = await supabase
          .from('airports')
          .select('*')
          .in('service_id', serviceIds)
          .order('sort_order');

        const airportMap: Record<string, any[]> = {};
        (airportsData || []).forEach((a: any) => {
          if (!airportMap[a.service_id]) airportMap[a.service_id] = [];
          airportMap[a.service_id].push(a);
        });
        setAirports(airportMap);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  // ─── Services CRUD ───────────────────────────────────────
  async function saveService(e: React.FormEvent) {
    e.preventDefault();
    setSavingService(true);
    try {
      if (editingService) {
        await supabase.from('services').update({
          title_ar: serviceForm.title_ar,
          title_en: serviceForm.title_en,
          wa_message_ar: serviceForm.wa_message_ar,
          wa_message_en: serviceForm.wa_message_en,
        }).eq('id', editingService.id);
      } else {
        await supabase.from('services').insert([{
          destination_id: destId,
          title_ar: serviceForm.title_ar,
          title_en: serviceForm.title_en,
          wa_message_ar: serviceForm.wa_message_ar,
          wa_message_en: serviceForm.wa_message_en,
          sort_order: services.length + 1,
        }]);
      }
      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({ title_ar: "", title_en: "", wa_message_ar: "", wa_message_en: "" });
      fetchAll();
    } catch (err) { console.error(err); }
    finally { setSavingService(false); }
  }

  async function deleteService(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟ سيتم حذف المطارات المرتبطة بها أيضاً.")) return;
    await supabase.from('airports').delete().eq('service_id', id);
    await supabase.from('services').delete().eq('id', id);
    fetchAll();
  }

  // ─── Airports CRUD ───────────────────────────────────────
  async function saveAirport(e: React.FormEvent, serviceId: string) {
    e.preventDefault();
    setSavingAirport(true);
    try {
      if (editingAirport) {
        await supabase.from('airports').update({
          name_ar: airportForm.name_ar,
          name_en: airportForm.name_en,
          wa_message_ar: airportForm.wa_message_ar,
          wa_message_en: airportForm.wa_message_en,
        }).eq('id', editingAirport.id);
      } else {
        await supabase.from('airports').insert([{
          service_id: serviceId,
          name_ar: airportForm.name_ar,
          name_en: airportForm.name_en,
          wa_message_ar: airportForm.wa_message_ar,
          wa_message_en: airportForm.wa_message_en,
          sort_order: (airports[serviceId]?.length || 0) + 1,
        }]);
      }
      setShowAirportForm(null);
      setEditingAirport(null);
      setAirportForm({ name_ar: "", name_en: "", wa_message_ar: "", wa_message_en: "" });
      fetchAll();
    } catch (err) { console.error(err); }
    finally { setSavingAirport(false); }
  }

  async function deleteAirport(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المطار؟")) return;
    await supabase.from('airports').delete().eq('id', id);
    fetchAll();
  }

  if (loading) return (
    <AdminLayout title="جاري التحميل...">
      <div className="p-10 text-center text-slate-500">جاري تحميل بيانات الوجهة...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout title={`خدمات: ${dest?.name_ar || ""}`}>
      {/* Back button */}
      <button
        onClick={() => navigate({ to: '/admin/destinations' })}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowRight className="size-4" />
        العودة للوجهات
      </button>

      {/* Destination info */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-8">
        <div className="flex items-center gap-4 p-5">
          {dest?.image_url && (
            <img src={dest.image_url} alt={dest.name_ar} className="size-16 rounded-xl object-cover shrink-0" />
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {dest?.name_ar}
              {dest?.flag_url && <img src={dest.flag_url} alt="flag" className="size-6 rounded-full object-cover" />}
            </h2>
            <p className="text-sm text-slate-500">{dest?.description_ar}</p>
          </div>
        </div>
      </div>

      {/* Services header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">الخدمات ({services.length})</h3>
        <button
          onClick={() => { setShowServiceForm(true); setEditingService(null); setServiceForm({ title_ar: "", title_en: "", wa_message_ar: "", wa_message_en: "" }); }}
          className="flex items-center gap-2 rounded-xl bg-[#5CA8DF] px-4 py-2 text-sm font-bold text-[#0F1F2C] hover:bg-[#6CB5E9] transition-colors"
        >
          <Plus className="size-4" />
          إضافة خدمة
        </button>
      </div>

      {/* Add/Edit Service Form */}
      {showServiceForm && (
        <div className="rounded-2xl border-2 border-[#5CA8DF]/30 bg-blue-50/30 p-6 mb-6">
          <h4 className="font-bold text-slate-800 mb-4">{editingService ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</h4>
          <form onSubmit={saveService} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم الخدمة (عربي)</label>
                <input required type="text" className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3" value={serviceForm.title_ar} onChange={e => setServiceForm({ ...serviceForm, title_ar: e.target.value })} placeholder="مثال: الموافقات الأمنية" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم الخدمة (إنجليزي)</label>
                <input required type="text" dir="ltr" className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-start" value={serviceForm.title_en} onChange={e => setServiceForm({ ...serviceForm, title_en: e.target.value })} placeholder="e.g. Security Approvals" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">رسالة الواتساب (عربي)</label>
              <textarea className="w-full rounded-lg border border-slate-200 bg-white p-3 h-20 text-sm" value={serviceForm.wa_message_ar} onChange={e => setServiceForm({ ...serviceForm, wa_message_ar: e.target.value })} placeholder="السلام عليكم، أرغب بالاستفسار عن..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">رسالة الواتساب (إنجليزي)</label>
              <textarea dir="ltr" className="w-full rounded-lg border border-slate-200 bg-white p-3 h-20 text-sm text-start" value={serviceForm.wa_message_en} onChange={e => setServiceForm({ ...serviceForm, wa_message_en: e.target.value })} placeholder="Hello, I'd like to inquire about..." />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setShowServiceForm(false); setEditingService(null); }} className="px-5 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200">إلغاء</button>
              <button type="submit" disabled={savingService} className="px-5 py-2 rounded-xl bg-[#0F1F2C] text-white font-bold hover:bg-[#162836] disabled:opacity-70 flex items-center gap-2">
                {savingService ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="size-4" />}
                {editingService ? "حفظ التعديلات" : "إضافة الخدمة"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="grid gap-4">
        {services.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            لا توجد خدمات بعد. اضغط "إضافة خدمة" للبدء.
          </div>
        ) : services.map(service => (
          <div key={service.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Service Header */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                  className="flex items-center gap-2 text-slate-800 font-bold hover:text-[#5CA8DF] transition-colors"
                >
                  {expandedService === service.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  {service.title_ar}
                </button>
                <span className="text-xs text-slate-400 font-medium">{service.title_en}</span>
                {airports[service.id]?.length > 0 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    <Plane className="size-3" />
                    {airports[service.id].length} مطار
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingService(service); setServiceForm({ title_ar: service.title_ar, title_en: service.title_en, wa_message_ar: service.wa_message_ar || "", wa_message_en: service.wa_message_en || "" }); setShowServiceForm(true); }}
                  className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors"
                  title="تعديل الخدمة"
                >
                  <Edit className="size-4" />
                </button>
                <button onClick={() => deleteService(service.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors" title="حذف الخدمة">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Airports Section (Expandable) */}
            {expandedService === service.id && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Plane className="size-4 text-slate-400" />
                    المطارات
                  </h5>
                  <button
                    onClick={() => { setShowAirportForm(service.id); setEditingAirport(null); setAirportForm({ name_ar: "", name_en: "", wa_message_ar: "", wa_message_en: "" }); }}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#5CA8DF] hover:text-[#3a8fc7] transition-colors"
                  >
                    <Plus className="size-3.5" />
                    إضافة مطار
                  </button>
                </div>

                {/* Add/Edit Airport Form */}
                {showAirportForm === service.id && (
                  <div className="rounded-xl border border-[#5CA8DF]/20 bg-white p-4 mb-4">
                    <form onSubmit={(e) => saveAirport(e, service.id)} className="grid gap-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">اسم المطار (عربي)</label>
                          <input required type="text" className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm" value={airportForm.name_ar} onChange={e => setAirportForm({ ...airportForm, name_ar: e.target.value })} placeholder="مطار القاهرة الدولي" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">اسم المطار (إنجليزي)</label>
                          <input required type="text" dir="ltr" className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-start" value={airportForm.name_en} onChange={e => setAirportForm({ ...airportForm, name_en: e.target.value })} placeholder="Cairo International Airport" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رسالة الواتساب (عربي)</label>
                        <input type="text" className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm" value={airportForm.wa_message_ar} onChange={e => setAirportForm({ ...airportForm, wa_message_ar: e.target.value })} placeholder="السلام عليكم، أرغب بحجز تذكرة..." />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => { setShowAirportForm(null); setEditingAirport(null); }} className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold">إلغاء</button>
                        <button type="submit" disabled={savingAirport} className="px-4 py-1.5 rounded-lg bg-[#0F1F2C] text-white text-sm font-bold disabled:opacity-70">
                          {savingAirport ? "جاري الحفظ..." : editingAirport ? "حفظ" : "إضافة"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Airports List */}
                {!airports[service.id]?.length ? (
                  <p className="text-xs text-slate-400 text-center py-3">لا توجد مطارات — اضغط "إضافة مطار"</p>
                ) : (
                  <div className="grid gap-2">
                    {airports[service.id].map(airport => (
                      <div key={airport.id} className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-slate-700">{airport.name_ar}</p>
                          <p className="text-xs text-slate-400">{airport.name_en}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => { setEditingAirport(airport); setAirportForm({ name_ar: airport.name_ar, name_en: airport.name_en, wa_message_ar: airport.wa_message_ar || "", wa_message_en: airport.wa_message_en || "" }); setShowAirportForm(service.id); }}
                            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="size-3.5" />
                          </button>
                          <button onClick={() => deleteAirport(airport.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
