import { useAuthControl } from "@/lib/useAuthControl";
import AppSidebar from "@/pages/Dashboard/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

function DashboardLayout() {
  useAuthControl();
  const [title, settitle] = useState<string>("")

  return (
    <SidebarProvider>
      {/* bg-gray-100 kaldırıldı, yerine tema değişkeni geldi */}
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar settitle={settitle} />
        <SidebarInset className="flex flex-col bg-background">
          <header className="flex h-14 justify-between items-center gap-4 border-b bg-card px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
            </div>

      
             

              <ModeToggle />
           
          </header>

          {/* İçerik alanına hafif bir ton farkı vererek kartları öne çıkarıyoruz */}
          <main className="flex-1 p-6 bg-muted/20">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;