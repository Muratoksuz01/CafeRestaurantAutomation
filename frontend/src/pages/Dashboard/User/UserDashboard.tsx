
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/pages/Dashboard/DashboardLayout";
import UserOverview from "./UserOverview";

function UserDashboard() {
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
                return <UserOverview />;
            
            default:
                return <UserOverview />;
        }
    };
    return (
        <DashboardLayout>
            {({ activeTab }: any) => renderContent(activeTab)}
        </DashboardLayout>
    );
}

export default UserDashboard;
