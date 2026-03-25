import AdminSidebar from "@/components/admin/AdminSidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin top bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 h-14 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin Panel</p>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}