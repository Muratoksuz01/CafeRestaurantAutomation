import { useAuthControl } from "@/hooks/useAuthControl";
import Sidebar from "@/pages/Dashboard/components/Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  useAuthControl(); // doğru kullanım

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;

