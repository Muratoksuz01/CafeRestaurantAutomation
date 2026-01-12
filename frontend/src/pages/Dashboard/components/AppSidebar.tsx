import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton, useSidebar,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LuLayoutDashboard,
  LuUsers,
  LuUtensilsCrossed,
  LuLayers,
  LuClipboardList,
  LuSettings,
  LuChefHat,
  LuListOrdered,
  LuShoppingBag,
  LuLogOut
} from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { getRole } from "@/lib/utils";
const MENU_CONFIG = {
  Yonetici: {
    title: "Yönetici Paneli",
    items: [
      { title: "Genel Bakış", url: "/admin/genel-bakis", icon: LuLayoutDashboard },
      { title: "Kullanıcılar", url: "/admin/kullanicilar", icon: LuUsers },
      { title: "Yemek Menüsü", url: "/admin/yemekler", icon: LuUtensilsCrossed },
      { title: "Kategoriler", url: "/admin/kategoriler", icon: LuLayers },
      { title: "Sipariş Yönetimi", url: "/admin/siparisler", icon: LuClipboardList },
      { title: "Rol Tanımları", url: "/admin/roller", icon: LuSettings },
    ]
  },
  Kasiyer: {
    title: "Kasiyer Paneli",
    items: [
      { title: "Kasa / Satış", url: "/user/satis-ekrani", icon: LuShoppingBag },
      { title: "Günlük İşlemler", url: "/user/islem-listesi", icon: LuListOrdered },
    ]
  },
  Garson: {
    title: "Garson Paneli",
    items: [
      { title: "Masalar ve Sipariş", url: "/user/masalar", icon: LuChefHat },
    ]
  }
};
function AppSidebar({settitle}:any) {
  const { open } = useSidebar(); // Sidebar'ın açık/kapalı durumunu alıyoruz
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user); // Store'dan user'ı çekiyoruz

  const role = getRole() as keyof typeof MENU_CONFIG;
  const config = MENU_CONFIG[role] || { title: "Panel", items: [] };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="py-4">
        <div className="flex flex-col px-2">
          {/* Sadece açıkken başlık ve isim görünsün */}
          {open ? (
            <>
              <span className="text-lg font-bold truncate">{config.title}</span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.firstName} {user?.lastName}
              </span>
            </>
          ) : (
            // Kapalıyken sadece logonun baş harfi veya küçük bir ikon koyabilirsin
            <span className="font-bold text-center">K</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>


        <SidebarGroup>
          <SidebarGroupLabel>{open && "Menü"}</SidebarGroupLabel>
          <SidebarGroupContent>
            {config.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.url}
                  tooltip={item.title}
                >
                  <Link  onClick={() => {
                    settitle(item.title)
                  }} to={item.url} className="flex items-center gap-3">
                    <item.icon className="text-foreground" />
                    <span className="text-foreground">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2"> {/* Padding'i biraz azalttık */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Çıkış Yap"
              className={`group transition-all duration-300 ease-in-out ${open
                ? "hover: bg-destructive/2 bg-destructive text-muted-foreground hover:text-destructive"
                : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"}  `}
            >
              <LuLogOut className={`${open ? "mr-2" : "mx-auto"} h-5 w-5 transition-colors duration-300 group-hover:text-destructive`}
              />
              {open && (
                <span className="font-medium transition-opacity duration-300">
                  Çıkış Yap
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar

