import { Sidebar,SidebarContent,SidebarFooter, SidebarGroup,SidebarGroupContent,
  SidebarGroupLabel,SidebarHeader,SidebarMenu,SidebarMenuButton, useSidebar,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {LuLayoutDashboard,LuUsers,LuUtensilsCrossed,
  LuLayers,LuClipboardList,LuSettings,LuChefHat,LuListOrdered,
  LuShoppingBag,LuLogOut
} from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
const MENU_CONFIG = {
  Yonetici: {
    title: "Yönetici Paneli",
    items: [
      { title: "Genel Bakış", url: "/admin/genel-bakis", icon: LuLayoutDashboard },
      { title: "Kullanıcılar", url: "/admin/kullanicilar", icon: LuUsers },
      { title: "Yemek Menüsü", url: "/admin/yemekler", icon: LuUtensilsCrossed },
      { title: "Kategoriler", url: "/admin/kategoriler", icon: LuLayers },
      { title: "Sipariş Yönetimi", url: "/admin/siparisler", icon: LuClipboardList },
      { title: "Adisyon ayarları", url: "/admin/yazıcılar", icon: LuClipboardList },
    //  { title: "Rol Tanımları", url: "/admin/roller", icon: LuSettings },
    ]
  },
  Kasiyer: {
    title: "Kasiyer Paneli",
    items: [
      { title: "Kasa / Satış", url: "/user/satis", icon: LuShoppingBag },
      { title: "Günlük İşlemler", url: "/user/masa", icon: LuListOrdered },
      { title: "Yazıcı ayarları", url: "/user/yazıcılar", icon: LuListOrdered },
    ]
  },
  Garson: {
    title: "Garson Paneli",
    items: [
      { title: "Masalar ve Sipariş", url: "/user/masalar", icon: LuChefHat },
    ]
  }
};
function AppSidebar({ settitle }: any) {
  const { open } = useSidebar(); // Sidebar'ın açık/kapalı durumunu alıyoruz
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user); // Store'dan user'ı çekiyoruz

  const role = user!.role as keyof typeof MENU_CONFIG;
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
                  <Link onClick={() => {
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
              onClick={() => {
                user!.role=="Yonetici" ?  navigate("/admin/profile"):navigate("/user/profile")   }}
              tooltip="Profil Ayarları"
              className={`group transition-all duration-300 ease-in-out border border-transparent ${open
                  ? "bg-transparent hover:bg-primary/10 text-muted-foreground hover:text-primary hover:border-primary/20"
                  : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                }`}
            >
              <LuSettings
                className={`${open ? "mr-2" : "mx-auto"
                  } h-5 w-5 transition-all duration-300 text-muted-foreground group-hover:text-primary group-hover:rotate-45`}
              />

              {open && (
                <span className="font-medium transition-opacity duration-300">
                  Profil & Ayarlar
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Çıkış Yap"
              className={`group transition-all duration-300 ease-in-out ${open
                ? "bg-transparent hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                } border border-transparent hover:border-destructive/30`}
            >
              <LuLogOut
                className={`${open ? "mr-2" : "mx-auto"
                  } h-5 w-5 transition-colors duration-300 text-muted-foreground group-hover:text-destructive`}
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

