import TopNav from "@/components/ui/TopNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopNav />
      <main>{children}</main>
    </div>
  );
}