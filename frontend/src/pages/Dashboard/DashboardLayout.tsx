import { useState } from "react";
import Sidebar from "@/pages/Dashboard/components/Sidebar";

function DashboardLayout({ children }: any) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="ml-64 flex-1 p-6">
        {children({ activeTab })}
      </main>
    </div>
  );
}

export default DashboardLayout;
