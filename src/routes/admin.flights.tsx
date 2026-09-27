import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Plane } from "lucide-react";

export const Route = createFileRoute("/admin/flights")({
  component: AdminFlights,
});

function AdminFlights() {
  return (
    <AdminLayout title="الرحلات والطيران">
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-500">إدارة المطارات وأسعار الطيران المرجعية.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-10 flex flex-col items-center justify-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
          <Plane className="size-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">قريباً...</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">سيتم تفعيل قسم الطيران هنا قريباً.</p>
      </div>
    </AdminLayout>
  );
}
