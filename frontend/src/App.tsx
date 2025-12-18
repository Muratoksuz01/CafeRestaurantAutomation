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
import { useAuthControl } from "./hooks/useAuthControl";
import ProtectedRoute from "./lib/ProtectedRoute";
import { getRole } from "./lib/utils";






function App() {
  const role = getRole()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {role == "Yonetici" && (
          <Route element={<ProtectedRoute allow={["Yonetici"]} />}>
            <Route path="/admin" element={<DashboardLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="overview" element={<AdminOverview />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="foods" element={<AdminFoods />} />
                  <Route path="category" element={<AdminCategory />} />
            </Route>
          </Route>
        )}
        {role && ["Kasiyer", "Garson"].includes(role) && (
            <Route element={<ProtectedRoute allow={["Kasiyer", "Garson"]} />}>
            <Route path="/user" element={<DashboardLayout />}>
                <Route index element={<UserOverview />} />
                <Route path="overview" element={<UserOverview />} />
                <Route path="userList" element={<UserList />} />
          </Route>
        </Route>
          )}





        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
