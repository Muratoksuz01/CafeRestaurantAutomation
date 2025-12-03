import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { useEffect } from "react";
import { LuChrome, LuLogOut, LuUsers } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const adminItems = [
  { id: "overview", label: "Overview", icon: LuChrome },
  { id: "users", label: "Users", icon: LuUsers },
  { id: "foods", label: "Foods", icon: LuUsers },
  { id: "category", label: "Kategoriler", icon: LuUsers },
];
const userItems=[
  { id: "overview", label: "Overview", icon: LuChrome },
]

export default function Sidebar({ activeTab, setActiveTab }: any) {
  const { user } = useSelector((state: RootState) => state.auth);
  const menuItems= user?.role=="admin" ? adminItems : userItems
   useEffect(()=>{
    console.log("sidebar user",user);
    
   },[])
  const navigate=useNavigate()
  const onLogout =() => {
    localStorage.clear()
    navigate("/")
  }
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-md p-4">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="w-full flex items-center gap-2 justify-start"
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Button>
        ))}
      </div>
      <Button
        variant="destructive"
        className="w-full  mt-auto"
        onClick={onLogout}
      >
        <LuLogOut className="w-5 h-5" />
        Logout
      </Button>
    </aside>
  );
}
