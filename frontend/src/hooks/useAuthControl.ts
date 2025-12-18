import { getRole } from "@/lib/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthControl() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = getRole();

    if (!role) {
      navigate("/login");
      return;
    }

    if (role === "Yonetici") navigate("/admin/overview");
    else if (role === "Kasiyer" || role === "Garson")
      navigate("/user/overview");
    else navigate("/login");
  }, []);
}
