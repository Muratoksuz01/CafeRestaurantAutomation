import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";
import Login from "./pages/Landing/Login";
import Register from "./pages/Landing/Register";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import UserOverview from "./pages/Dashboard/User/UserOverview";
import AdminOverview from "./pages/Dashboard/Admin/AdminOverview";
import AdminUsers from "./pages/Dashboard/Admin/AdminUsers";
import AdminFoods from "./pages/Dashboard/Admin/AdminFoods";
import AdminCategory from "./pages/Dashboard/Admin/AdminCategory";
import AdminOrders from "./pages/Dashboard/Admin/AdminOrders";
import useAuthStore from "./store/useAuthStore";
import TableList from "./pages/Dashboard/User/TableList";
import Profile from "./pages/Landing/Profile";




function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const user = useAuthStore((state) => state.user);

  return (

    <Routes>
      <Route path="/" element={<Navigate to={"/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {user?.role === "Yonetici" && (
        <Route path="/admin" element={<DashboardLayout />}>

          <Route index element={<Navigate to="genel-bakis" />} />
          <Route path="genel-bakis" element={<AdminOverview />} />
          <Route path="kullanicilar" element={<AdminUsers />} />
          <Route path="yemekler" element={<AdminFoods />} />
          <Route path="kategoriler" element={<AdminCategory />} />
          <Route path="siparisler" element={<AdminOrders />} />
          <Route path="profile" element={<Profile />} />

        </Route>

      )}


      {user?.role == "Kasiyer" && (
        <Route path="user" element={<DashboardLayout />}>
          <Route index element={<Navigate to="satis" />} />
          <Route path="satis" element={<UserOverview />} />
          <Route path="masa" element={<TableList />} />
          <Route path="profile" element={<Profile />} />

        </Route>
      )}


      {user?.role == "Garson" && (
        <Route path="user" element={<DashboardLayout />}>
          <Route index element={<Navigate to="satis" />} />
          <Route path="satis" element={<UserOverview />} />
          <Route path="profile" element={<Profile />} />

        </Route>
      )}








      <Route path="401" element={<NotFound />} />


      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>

  );
}

export default App;
