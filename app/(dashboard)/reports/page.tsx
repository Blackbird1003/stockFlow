"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Plus, FileText, RefreshCw, Clock } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { ReportCard } from "@/components/reports/report-card";
import { CreateReportModal } from "@/components/reports/create-report-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface InventoryLog {
  id: string;
  action: string;
  quantityChange: number;
  previousQty?: number | null;
  newQty?: number | null;
  createdAt: string;
  product: { name: string; sku: string };
}

interface Report {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  data: unknown;
  createdAt: string;
}

const actionColors: Record<string, string> = {
  "Product Added": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Product Updated": "bg-blue-100 text-blue-700 border-blue-200",
  "Product Deleted": "bg-red-100 text-red-700 border-red-200",
  "Stock Increased": "bg-teal-100 text-teal-700 border-teal-200",
  "Stock Reduced": "bg-orange-100 text-orange-700 border-orange-200",
};

export default function ReportsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [reports, setReports] = useState<Report[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");

  const fetchData = useCallback(async () => {
    try {
      const [reportsRes, logsRes] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/logs?limit=50"),
      ]);
      if (reportsRes.ok) setReports(await reportsRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } catch (error) {
      console.error("Reports fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/reports/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== deleteId));
      } else {
        const json = await res.json();
        alert(json.error);
      }
    } catch {
      alert("Delete failed");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Reports" description="Generate and manage inventory analytics" />

      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="reports">
                Reports
                <Badge className="ml-2 bg-indigo-600 text-white text-[10px] py-0">{reports.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="logs">
                Activity Log
                <Badge className="ml-2 bg-slate-500 text-white text-[10px] py-0">{logs.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchData} className="gap-1.5 text-slate-600">
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
              {isAdmin && activeTab === "reports" && (
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Generate Report
                </Button>
              )}
            </div>
          </div>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 rounded-xl" />
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-600 font-medium mb-1">No reports yet</h3>
                <p className="text-slate-400 text-sm mb-4">Generate your first inventory report</p>
                {isAdmin && (
                  <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                    Generate Report
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    isAdmin={isAdmin}
                    onDelete={setDeleteId}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="logs" className="mt-0">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-20">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No activity recorded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Badge
                        className={`text-[10px] py-0.5 flex-shrink-0 ${actionColors[log.action] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                        variant="outline"
                      >
                        {log.action}
                      </Badge>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{log.product.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{log.product.sku}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                      <div className="text-right hidden sm:block">
                        <p className={`text-sm font-bold ${log.quantityChange > 0 ? "text-emerald-600" : log.quantityChange < 0 ? "text-red-600" : "text-slate-600"}`}>
                          {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                        </p>
                        {log.previousQty !== null && log.newQty !== null && (
                          <p className="text-xs text-slate-400">
                            {log.previousQty} → {log.newQty}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{formatDate(log.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CreateReportModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchData}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
