import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto bg-background-light scroll-smooth">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-primary text-white">
          <div className="flex items-center gap-2">
            <span className="material-icons-round">apartment</span>
            <span className="font-bold">Al-Diyar</span>
          </div>
          <button className="p-2">
            <span className="material-icons-outlined">menu</span>
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
