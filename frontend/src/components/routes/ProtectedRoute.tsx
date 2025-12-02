import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/store";

export default function ProtectedRoute({ children, role }: any) {
  const { user,loading } = useSelector((state: RootState) => state.auth);
 if (loading) {
    return <div className="p-4">Yükleniyor...</div>;
  }
  if (!user) return <Navigate to="/login"  />;

  if (role && user.role == role)   return children  

}
