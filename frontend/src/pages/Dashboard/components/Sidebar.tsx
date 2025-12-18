import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LuChrome, LuLogOut, LuUsers } from "react-icons/lu";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { getRole } from "@/lib/utils";
import { useEffect, useState } from "react";

const yoneticiItems = [
  { path: "/admin/overview", label: "Overview", icon: LuChrome },
  { path: "/admin/users", label: "Users", icon: LuUsers },
  { path: "/admin/foods", label: "Foods", icon: LuUsers },
  { path: "/admin/category", label: "Kategoriler", icon: LuUsers },
];
const kasiyerItems = [
  { path: "/user/userList", label: "Listeler", icon: LuChrome },
];
const garsonItems=[
  { path: "/user/overview", label: "Overview", icon: LuChrome },
]
export default function Sidebar() {
  let menuItems: any[] = []
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = getRole()
  switch (role) {
    case "Garson":
      menuItems = garsonItems
      break;
    case "Kasiyer":
      menuItems = garsonItems.concat(kasiyerItems)
      break;
    case "Yonetici":
      menuItems = yoneticiItems
      break;
    
  }
  // menuItems = role === "Yonetici" ? adminItems : userItems;
  const [activeTab, setActiveTab] = useState("")
  useEffect(() => {
    const link = window.location.pathname
    console.log(link);
    setActiveTab(link)

  }, [activeTab])
  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  //   const { user, loading, error } = useSelector((state: RootState) => state.auth);
const panelTitle = (() => {
  switch (role) {
    case "Yonetici":
      return "Admin Panel";
    case "Kasiyer":
      return "Kasiyer Panel";
    case "Garson":
      return "Garson Panel";
    default:
      return "Bilinmiyor";
  }
})();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-md p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-4">
        {panelTitle}

      </h1>

      <div className="space-y-2 flex-1">
        {/* {user?.firstName} */}
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              className={
                `w-full flex items-center gap-2 justify-start ` +
                (activeTab === item.path
                  ? "bg-[#FFBFD6] text-white rounded-md"
                  : "text-gray-700")
              }
              onClick={() => setActiveTab(item.path)}
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
