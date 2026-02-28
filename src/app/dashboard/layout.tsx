import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  // Not logged in → redirect to sign in
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto scroll-smooth">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-primary text-white">
          <div className="flex items-center gap-2">
            <span className="material-icons-round">apartment</span>
            <span className="font-bold">Al-Diyar</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2">
              <span className="material-icons-outlined">menu</span>
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
