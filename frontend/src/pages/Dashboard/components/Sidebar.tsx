import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LuChrome, LuLogOut, LuUsers } from "react-icons/lu";

const adminItems = [
  { path: "/admin/overview", label: "Overview", icon: LuChrome },
  { path: "/admin/users", label: "Users", icon: LuUsers },
  { path: "/admin/foods", label: "Foods", icon: LuUsers },
  { path: "/admin/category", label: "Kategoriler", icon: LuUsers },
];

const userItems = [
  { path: "/user/overview", label: "Overview", icon: LuChrome },
  { path: "/user/userList", label: "Listeler", icon: LuChrome },
];
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { getRole } from "@/lib/utils";
export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = getRole()
  const menuItems = role === "admin" ? adminItems : userItems;

  const onLogout = () => {
   
    dispatch(logout());   
    navigate("/login");

  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-md p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-4">
        {role === "admin"
          ? "Admin Panel"
          : role === "user"
            ? "User Panel"
            : "bilinmiyore "}
      </h1>

      <div className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 justify-start"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>

      <Button
        variant="destructive"
        className="w-full mt-auto bg-gradient-to-r from-[#E83C91] to-[#FF8FB7] cursor-pointer" 
        onClick={onLogout}
      >
        <LuLogOut className="w-5 h-5" />
        Logout
      </Button>
    </aside>
  );
}
