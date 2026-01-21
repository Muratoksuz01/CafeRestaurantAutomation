import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useAuthControl() {
    const user = useAuthStore((state) => state.user);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = user!.role
    console.log("useauthcontrol:",location)
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
    if (role === "Yonetici") navigate("/admin", { replace: true });
    else if (role === "Kasiyer" || role === "Garson")
      navigate("/user", { replace: true });
    else navigate("/login", { replace: true });

  }, []);
}
