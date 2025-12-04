import DashboardLayout from "../DashboardLayout";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminFoods from "./AdminFoods";
import AdminCategory from "./AdminCategory";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const { user, loading, error } = useSelector((state: RootState) => state.auth);
const navigate=useNavigate()
    useEffect(() => {
        let token = localStorage.getItem("token")
        if (token) {
            if (user?.role == "admin")
                navigate("/admin")
            else if (user?.role == "user")
                navigate("/user")
            
        }else{
            navigate("/login")
        }
    }, [])
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
