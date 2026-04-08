import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { TrendingUp, Users, Receipt, Wallet } from "lucide-react";
import { API_PATHS } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ApiResponse } from "@/lib/apiTypes";
import { useIsMobile } from "@/lib/use-mobile";

type AdminStats = {
  totalIncome: number;
  totalExpense: number;
  employeeCount: number;
  topFood: {
    name: string;
    count: number;
  };
  userStats: {
    totalUsers: number,
    totalAdmins: number
  }
  monthlySalesChart: { day: string; total: number }[];
};
export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
const [error, setError] = useState("")
const isMobile = useIsMobile();
const tickFontSize = isMobile ? 12 : 16;

const [loading, setLoading] = useState(false) 
useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get<ApiResponse<AdminStats>>(API_PATHS.getAdminStats);
      if (res.data.status) {
        setStats(res.data.data);
      }
      else{
        setError(res.data.message || "verileri cekerken hata olustu")
      }
    } catch (error) {
      console.error(error)
    }finally{
      setLoading(false)
    }
  };

 if (loading)
  return <div className="p-6 text-center animate-pulse text-muted-foreground">Yükleniyor...</div>;

if (error)
  return <div className="p-6 text-center text-destructive">{error}</div>;

if (!stats)
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-card border border-border rounded-xl shadow-md space-y-4">
      <p className="text-lg font-semibold text-foreground/80">Veri bulunamadı</p>
      <p className="text-sm text-muted-foreground text-center">
        Henüz herhangi bir veri yok veya yüklenemedi. Lütfen daha sonra tekrar deneyin.
      </p>
    </div>
  );
  return (
    <div className="p-4 sm:p-6 space-y-6 bg-transparent">
  {/* Başlık */}
  <div className="flex flex-col gap-1 mb-4 sm:mb-6">
    <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-foreground">
      Genel Yönetim Paneli
    </h1>
    <p className="text-sm sm:text-lg text-foreground/70 font-medium">
      İşletmenizin güncel durumunu buradan takip edebilirsiniz.
    </p>
  </div>

  {/* Üst Kartlar */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      title="Bu Ay Kazanç"
      value={`${stats.totalIncome || 0} ₺`}
      icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />}
      className="border-emerald-500/20 bg-emerald-500/5 shadow-sm shadow-emerald-500/10"
    />
    <StatCard
      title="Bu Ay Gider"
      value={`${stats.totalExpense || 0} ₺`}
      icon={<Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />}
      className="border-rose-500/20 bg-rose-500/5 shadow-sm shadow-rose-500/10"
    />
    <StatCard
      title="Toplam Çalışan"
      value={`${stats.userStats.totalUsers || 0}`}
      icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />}
      className="border-blue-500/20 bg-blue-500/5 shadow-sm shadow-blue-500/10"
    />
    <StatCard
      title="En Çok Satılan"
      value={stats.topFood?.name || "-"}
      subValue={`${stats.topFood?.count || 0} Adet Satıldı`}
      icon={<Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />}
      className="border-orange-500/20 bg-orange-500/5 shadow-sm shadow-orange-500/10"
    />
  </div>

  {/* Grafik Kartı */}
  <Card className="border border-border/50 shadow-xl bg-card">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2 text-foreground">
        <div className="p-2 bg-primary/10 rounded-lg">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        Aylık Satış Analizi
      </CardTitle>
      <p className="text-xs sm:text-sm text-muted-foreground ml-10 sm:ml-12">
        Son 30 günlük satış performansınız
      </p>
    </CardHeader>

    <CardContent className="h-[300px] sm:h-[400px] w-full pt-4 sm:pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={stats.monthlySalesChart.length ? stats.monthlySalesChart : [{ day: "-", total: 0 }]}
          margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            dy={5}
            tick={{ fill: "currentColor", fontSize: tickFontSize, fontWeight: 600 }}
          />
          <YAxis tick={{ fill: "currentColor", fontSize: tickFontSize, fontWeight: 600 }} />
          <Tooltip
            cursor={{ stroke: "hsl(var(--primary)/0.2)", strokeWidth: 2 }}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderRadius: "12px",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 10px 15px -5px rgb(0 0 0 / 0.3)",
              padding: "8px",
            }}
            itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold", fontSize: "12px" }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "semibold", marginBottom: "2px" }}
            labelFormatter={(value) => `Gün ${value}`}
            formatter={(value) => [`${value} ₺`, "Total"]}
          />
          <Line
            type="monotone"
            dataKey="total"
            strokeWidth={3}
            stroke="#0c2bf2"
            activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</div>
  );
}

// Küçük Yardımcı Bileşen: StatCard
function StatCard({ title, value, subValue, icon, className }: any) {
  return (
    <Card className={`border border-border/50 shadow-xl bg-card transition-all hover:ring-2 hover:ring-primary/20 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          {/* Başlık: Font boyutu büyütüldü ve kontrast artırıldı */}
          <p className="text-base font-semibold tracking-tight text-foreground/80">
            {title}
          </p>
          {/* İkon Kutusu: Daha belirgin bir arka plan */}
          <div className="p-2.5 bg-secondary/80 rounded-xl shadow-inner border border-border/50">
            {icon}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {/* Değer: text-3xl ile çok daha görünür */}
          <div className="text-3xl font-extrabold tracking-tight text-foreground leading-none">
            {value}
          </div>
          {/* Alt Metin: Daha belirgin renk */}
          {subValue && (
            <p className="text-sm font-medium text-primary/90 mt-1 uppercase tracking-wider">
              {subValue}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}