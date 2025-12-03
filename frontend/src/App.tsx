
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import UserLayout from "./components/UserLayout";
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
import Menuler from "./pages/Landing/Menuler";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";





function App() {
  //  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  
/*   const [user, setUser] = useState<any>(null)
  useEffect(() => {
    console.log("app.tsx usef calişti getUser");
    const user=localStorage.getItem("user")
    if(!user){
      dispatch(getUser()).then((res) => {
        console.log(res);
        if(res.type=="auth/getUser/rejected"){
          setUser({})
        }if(res.type=="auth/getUser/fulfilled"){
          setUser(res.payload.data.user)
        }
        
      })
    }else{
      setUser(JSON.parse(user))
    }
    console.log("app.tsx user:",user);
    
  }, []);
 */
   useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />

          {/* Giriş yapılmışsa login/register'a izin verme */}
          <Route
            path="login"
            element={
              <ProtectedAuthRoute>
                <Login />
              </ProtectedAuthRoute>
            }
          />
          <Route
            path="register"
            element={
              <ProtectedAuthRoute>
                <Register />
              </ProtectedAuthRoute>
            }
          />

          <Route path="menuler" element={<Menuler />} />
        </Route>

        {/* Admin korumalı */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Landing />} />
        </Route>

        {/* User korumalı */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Landing />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
