import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Landing/Login";
import Register from "./pages/Landing/Register";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import UserOverview from "./pages/Dashboard/User/UserOverview";
import UserList from "./pages/Dashboard/User/UserList";
import AdminOverview from "./pages/Dashboard/Admin/AdminOverview";
import AdminUsers from "./pages/Dashboard/Admin/AdminUsers";
import AdminFoods from "./pages/Dashboard/Admin/AdminFoods";
import AdminCategory from "./pages/Dashboard/Admin/AdminCategory";
import ProtectedRoute from "./lib/ProtectedRoute";
import AdminOrders from "./pages/Dashboard/Admin/AdminOrders";
import AdminRoles from "./pages/Dashboard/Admin/AdminRoles";
import { DataTableDemo } from "./components/DataTableDemo";
import useAuthStore from "./store/useAuthStore";






function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Yönetici Route Grubu */}
        {user?.role === "Yonetici" && (
          <Route element={<ProtectedRoute allow={["Yonetici"]} />}>
            <Route path="/admin" element={<DashboardLayout />}>
              {/* /admin yazıldığında otomatik olarak genel-bakis'a yönlendirir */}
              <Route index element={<Navigate to="genel-bakis" />} />

              <Route path="genel-bakis" element={<AdminOverview />} />
              <Route path="kullanicilar" element={<AdminUsers />} />
              <Route path="yemekler" element={<AdminFoods />} />
              <Route path="kategoriler" element={<AdminCategory />} />
              <Route path="siparisler" element={<AdminOrders />} />
              <Route path="roller" element={<AdminRoles />} />
              <Route path="gereksiz" element={<DataTableDemo />} />
            </Route>
          </Route>
        )}

        {/* Kasiyer ve Garson Route Grubu */}
        {user?.role && ["Kasiyer", "Garson"].includes(user.role) && (
          <Route element={<ProtectedRoute allow={["Kasiyer", "Garson"]} />}>
            <Route path="/user" element={<DashboardLayout />}>
              {/* Kullanıcının rolüne göre ana sayfayı belirle */}
              <Route index element={
                user.role === "Kasiyer"
                  ? <Navigate to="satis-ekrani" />
                  : <Navigate to="masalar" />
              } />

              {/* Kasiyer Özel */}
              <Route path="satis-ekrani" element={<UserOverview />} />
              <Route path="islem-listesi" element={<UserList />} />

              {/* Garson Özel (veya ortak) */}
              <Route path="masalar" element={<UserOverview />} />
            </Route>
          </Route>
        )}






        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
