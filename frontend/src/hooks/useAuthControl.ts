import {jwtDecode} from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface TokenPayload {
  userId: string;
  role: string;
}

export function useAuthControl() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode<TokenPayload>(token);

    if (decoded.role === "admin") navigate("/admin/overview");
    if (decoded.role === "user") navigate("/user/overview");
  }, []);
}
