import { getRole } from "@/lib/utils";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useAuthControl() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = getRole();

    if (!role) {
      navigate("/login", { replace: true });
      return;
    }

    const lastPath = localStorage.getItem("lastPath");

    // refresh → aynı sayfada kal
    if (location.pathname !== "/login") {
      localStorage.setItem("lastPath", location.pathname);
      return;
    }

    // ilk giriş
    if (lastPath) {
      navigate(lastPath, { replace: true });
      return;
    }

    // fallback
    if (role === "Yonetici") navigate("/admin/overview", { replace: true });
    else if (role === "Kasiyer" || role === "Garson")
      navigate("/user/overview", { replace: true });
    else navigate("/login", { replace: true });

  }, []);
}
