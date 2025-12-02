import { RootState } from "@/store";
import DashboardLayout from "../DashboardLayout";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import { useSelector } from "react-redux";
import AdminFoods from "./AdminFoods";

function AdminDashboard() {
    const { user } = useSelector((state: RootState) => state.auth);

    const renderContent = (activeTab: string) => {
        switch (activeTab) {
            case "overview":
                return <AdminOverview />;
            case "users":
                return <AdminUsers />;
            case "foods":
                return <AdminFoods />;
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
