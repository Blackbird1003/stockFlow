import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { AIChat } from "@/components/dashboard/ai-chat";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <footer className="shrink-0 border-t border-slate-200 bg-white px-6 py-2.5 flex items-center justify-between text-xs text-slate-400">
          <span>© {new Date().getFullYear()} StockFlow. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          </div>
        </footer>
      </div>
      <AIChat />
    </div>
  );
}
