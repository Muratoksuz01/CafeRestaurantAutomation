import DashboardLayout from "../DashboardLayout";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminFoods from "./AdminFoods";
import AdminCategory from "./AdminCategory";

function AdminDashboard() {
    const renderContent = (activeTab: string) => {
        switch (activeTab) {
            case "overview":
                return <AdminOverview />;
            case "users":
                return <AdminUsers />;
            case "foods":
                return <AdminFoods />;
            case "category":
                return <AdminCategory />;
            default:
                return <AdminOverview />;
        }
    };
    return (
        <DashboardLayout>
            {({ activeTab }: any) => renderContent(activeTab)}
        </DashboardLayout>
    );
}

export default AdminDashboard;
