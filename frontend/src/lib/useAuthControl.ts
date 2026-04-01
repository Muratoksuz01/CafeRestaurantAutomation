import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { JwtToken } from "./apiTypes";

export function useAuthControl() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout=()=> {
    logout()
    navigate("/login",{replace:true})
  }
  const checkTokenIntegrity = (): boolean => {
    if (!token) return false;

    try {
      // 1. Decode işlemi (Hata fırlatabilecek kritik nokta)
      const decoded = jwtDecode<JwtToken>(token);

      // 2. Süre kontrolü (Exp)
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.warn("Token süresi dolmuş!");
        handleLogout();
        return false;
      }

      // 3. Beklenen alanların kontrolü
      if (!decoded.userId || !decoded.roleName) {
        console.error("Token içeriği eksik!");
        handleLogout();
        return false;
      }

      return true;
    } catch (error) {
      // Kullanıcı tokeni değiştirdiğinde veya geçersiz karakter girdiğinde buraya düşer
      console.error("Geçersiz veya kurcalanmış token tespit edildi!");
      handleLogout(); // Hemen dışarı at
      return false;
    }
  };
  useEffect(() => {
    console.log(location.pathname)
    // 1. Kullanıcı yoksa ve login/register dışında bir yerdeyse login'e at
    if (!user) {
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        localStorage.setItem("lastPath", location.pathname);
        navigate("/login", { replace: true });
      }
      return;
    }
    if(!checkTokenIntegrity())
          return
    // 2. Kullanıcı varsa ve /login sayfasındaysa yönlendir
    if (location.pathname === "/login" || location.pathname === "/register") {
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