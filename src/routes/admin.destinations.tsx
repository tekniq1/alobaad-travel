import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Map, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/admin/destinations")({
  component: AdminDestinations,
});

function AdminDestinations() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    slug: "",
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    image_url: "",
    flag_url: "",
    sort_order: 1
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  async function fetchDestinations() {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const [editingDest, setEditingDest] = useState<any | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('destinations')
        .insert([formData]);
        
      if (error) throw error;
      
      setShowModal(false);
      setFormData({ slug: "", name_ar: "", name_en: "", description_ar: "", description_en: "", image_url: "", flag_url: "", sort_order: 1 });
      fetchDestinations();
    } catch (error) {
      console.error("Error adding destination:", error);
      alert("حدث خطأ أثناء الإضافة. تأكد أن المعرف (slug) غير مكرر.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingDest) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('destinations')
        .update({
          name_ar: editingDest.name_ar,
          name_en: editingDest.name_en,
          description_ar: editingDest.description_ar,
          description_en: editingDest.description_en,
          image_url: editingDest.image_url,
          flag_url: editingDest.flag_url,
          sort_order: editingDest.sort_order,
        })
        .eq('id', editingDest.id);
        
      if (error) throw error;
      setEditingDest(null);
      fetchDestinations();
    } catch (error) {
      console.error("Error updating destination:", error);
      alert("حدث خطأ أثناء التعديل.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الوجهة؟")) return;
    try {
      await supabase.from('destinations').delete().eq('id', id);
      fetchDestinations();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }

  return (
    <AdminLayout title="الوجهات السياحية">
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-500">إدارة كافة الوجهات السياحية والخدمات المرتبطة بها.</p>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#5CA8DF] px-4 py-2 text-sm font-bold text-[#0F1F2C] hover:bg-[#6CB5E9] transition-colors"
        >
          <Plus className="size-4" />
          إضافة وجهة
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center text-slate-500">جاري تحميل الوجهات...</div>
      ) : destinations.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-10 flex flex-col items-center justify-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
            <Map className="size-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">لا توجد وجهات مضافة بعد</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">انقر على "إضافة وجهة" للبدء بإضافة الدول والبرامج السياحية.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <div key={dest.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              {/* صورة الوجهة */}
              <div className="h-44 relative overflow-hidden">
                <img
                  src={dest.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop'}
                  alt={dest.name_ar}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* اسم الوجهة فوق الصورة */}
                <div className="absolute bottom-0 right-0 left-0 p-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{dest.name_ar}</h3>
                    <p className="text-white/70 text-xs mt-0.5">{dest.name_en}</p>
                  </div>
                  {dest.flag_url && (
                    <img src={dest.flag_url} alt="flag" className="size-9 rounded-full object-cover border-2 border-white shadow-md shrink-0" />
                  )}
                </div>

                {/* ترتيب العرض */}
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                  #{dest.sort_order}
                </div>
              </div>

              {/* محتوى الكارت */}
              <div className="p-4">
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[40px]">{dest.description_ar}</p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  {/* زر إدارة الخدمات */}
                  <button
                    onClick={() => navigate({ to: '/admin/destinations/$destId/services', params: { destId: dest.id } })}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#5CA8DF] hover:text-[#3a8fc7] transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                  >
                    <Plus className="size-3.5" />
                    إدارة الخدمات
                  </button>

                  {/* أزرار التعديل والحذف */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDest({...dest})}
                      className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors"
                      title="تعديل الوجهة"
                    >
                      <Edit className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dest.id)}
                      className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف الوجهة"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <h2 className="text-xl font-bold text-slate-800">إضافة وجهة سياحية جديدة</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                إغلاق
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 grid gap-6">
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الاسم (عربي)</label>
                  <input required type="text" className="h-10 w-full rounded-lg border border-slate-200 px-3" value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الاسم (انجليزي)</label>
                  <input required type="text" dir="ltr" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-start" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">المعرف البرمجي (Slug)</label>
                <input required type="text" dir="ltr" placeholder="مثال: egypt" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-start" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                <p className="text-xs text-slate-500 mt-1">يستخدم في الروابط، يجب أن يكون إنجليزي وبدون مسافات.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الوصف (عربي)</label>
                  <textarea required className="w-full rounded-lg border border-slate-200 p-3 h-20" value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الوصف (انجليزي)</label>
                  <textarea required dir="ltr" className="w-full rounded-lg border border-slate-200 p-3 h-20 text-start" value={formData.description_en} onChange={e => setFormData({...formData, description_en: e.target.value})} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">رابط صورة الوجهة</label>
                  <input type="text" dir="ltr" placeholder="/egypt-pyramids.jpg" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-start" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">رابط صورة العلم</label>
                  <input type="text" dir="ltr" placeholder="/flag-egypt.jpg" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-start" value={formData.flag_url} onChange={e => setFormData({...formData, flag_url: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold hover:bg-slate-200">
                  إلغاء
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-[#0F1F2C] text-white font-bold hover:bg-[#162836] disabled:opacity-70">
                  {saving ? "جاري الحفظ..." : "إضافة الوجهة"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <h2 className="text-xl font-bold text-slate-800">تعديل: {editingDest.name_ar}</h2>
              <button onClick={() => setEditingDest(null)} className="text-slate-400 hover:text-slate-700 text-sm">
                إغلاق
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 grid gap-6">

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الاسم (عربي)</label>
                  <input required type="text" className="h-10 w-full rounded-lg border border-slate-200 px-3" value={editingDest.name_ar} onChange={e => setEditingDest({...editingDest, name_ar: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الاسم (انجليزي)</label>
                  <input required type="text" dir="ltr" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-start" value={editingDest.name_en} onChange={e => setEditingDest({...editingDest, name_en: e.target.value})} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الوصف (عربي)</label>
                  <textarea required className="w-full rounded-lg border border-slate-200 p-3 h-20" value={editingDest.description_ar} onChange={e => setEditingDest({...editingDest, description_ar: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الوصف (انجليزي)</label>
                  <textarea required dir="ltr" className="w-full rounded-lg border border-slate-200 p-3 h-20 text-start" value={editingDest.description_en} onChange={e => setEditingDest({...editingDest, description_en: e.target.value})} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">رابط صورة الوجهة</label>
                  <input type="text" dir="ltr" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-start" value={editingDest.image_url || ""} onChange={e => setEditingDest({...editingDest, image_url: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">رابط صورة العلم</label>
                  <input type="text" dir="ltr" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-start" value={editingDest.flag_url || ""} onChange={e => setEditingDest({...editingDest, flag_url: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">ترتيب العرض</label>
                <input type="number" className="h-10 w-32 rounded-lg border border-slate-200 px-3" value={editingDest.sort_order || 1} onChange={e => setEditingDest({...editingDest, sort_order: Number(e.target.value)})} />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditingDest(null)} className="px-6 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold hover:bg-slate-200">
                  إلغاء
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-[#5CA8DF] text-[#0F1F2C] font-bold hover:bg-[#6CB5E9] disabled:opacity-70">
                  {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
