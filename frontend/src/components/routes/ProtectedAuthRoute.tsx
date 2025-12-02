import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/store";

export default function ProtectedAuthRoute({ children }: any) {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  if (loading) {
    return <div className="p-4">Yükleniyor...</div>;
  }
  if (user) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "user") return <Navigate to="/user" replace />;
  }

  return children;
}
