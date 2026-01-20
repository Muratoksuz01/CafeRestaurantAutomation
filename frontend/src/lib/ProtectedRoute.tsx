import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UserRole } from "@/models/User";

export default function ProtectedRoute({ allow }: { allow: ("Yonetici" | "Kasiyer" | "Garson" | "Asci")[] }) {
  const [role, setRole] = useState<UserRole>()
  useEffect(() => {
    const r = getRole();
    if (r !== null) setRole(r)
  }, [])

  if (!role) return <Navigate to="/login" replace />;

  if (!allow.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
