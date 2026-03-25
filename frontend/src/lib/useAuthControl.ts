import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useAuthControl() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Kullanıcı yoksa ve login/register dışında bir yerdeyse login'e at
    if (!user) {
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        localStorage.setItem("lastPath", location.pathname);
        navigate("/login", { replace: true });
      }
      return;
    }

    // 2. Kullanıcı varsa ve /login sayfasındaysa yönlendir
    if (location.pathname === "/login") {
      const lastPath = localStorage.getItem("lastPath");
      
      if (lastPath && lastPath !== "/login") {
        navigate(lastPath, { replace: true });
      } else {
        // Rolüne göre ana sayfaya gönder
        const target = user.role === "Yonetici" ? "/admin" : "/user";
        navigate(target, { replace: true });
      }
      return;
    }

    // 3. Geçerli bir sayfadaysa konumu kaydet (Refresh için kritik nokta)
    if (location.pathname !== "/login" && location.pathname !== "/register") {
      localStorage.setItem("lastPath", location.pathname);
    }
  }, [location.pathname, user, navigate]);
}