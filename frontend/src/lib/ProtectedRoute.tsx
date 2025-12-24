import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "@/lib/utils";

export default function ProtectedRoute({ allow }: { allow: ("Yonetici" | "Kasiyer" | "Garson" | "Asci")[] }) {
  const role = getRole();

  if (!role) return <Navigate to="/login" replace />;

  if (!allow.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
