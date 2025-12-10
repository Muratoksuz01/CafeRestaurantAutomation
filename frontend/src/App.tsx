
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useDispatch, useSelector, } from "react-redux";
import { AppDispatch, RootState, store, } from "./store";
import { useEffect, useState } from "react";
import { getUser } from "./store/slices/authSlice";
import ProtectedAuthRoute from "./components/routes/ProtectedAuthRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Layout from "./pages/Landing/Layout";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Landing/Login";
import Register from "./pages/Landing/Register";
import Menu from "./pages/Landing/Menu";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";

import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import UserOverview from "./pages/Dashboard/User/UserOverview";
import UserList from "./pages/Dashboard/User/UserList";
import AdminOverview from "./pages/Dashboard/Admin/AdminOverview";
import AdminUsers from "./pages/Dashboard/Admin/AdminUsers";
import AdminFoods from "./pages/Dashboard/Admin/AdminFoods";
import AdminCategory from "./pages/Dashboard/Admin/AdminCategory";





function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="menu" element={<Menu />} />
        </Route>

        {/* Admin korumalı */}
        <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="overview" element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="foods" element={<AdminFoods />} />
              <Route path="category" element={<AdminCategory />} />
        </Route>



        {/* User korumalı */}
        <Route path="/user" element={<DashboardLayout />}>
          <Route index element={<UserOverview />} />
          <Route path="overview" element={<UserOverview />} />
          <Route path="userList" element={<UserList />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
