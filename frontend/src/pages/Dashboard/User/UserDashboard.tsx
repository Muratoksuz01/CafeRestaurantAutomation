import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { useAuthControl } from "@/hooks/useAuthControl";

export default function UserDashboard() {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        useAuthControl();



    }, []);

    return null; // Artık layout burada değil
}
