import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { TrendingUp, Users, Receipt, Wallet } from "lucide-react";
import { API_PATHS } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await axiosInstance.get(API_PATHS.getAdminStats);
    if (res.data.success) {
      setStats(res.data.data);
    }
  };

  if (!stats) return <div className="p-6 text-center animate-pulse text-muted-foreground">Yükleniyor...</div>;

  return (
    <div className="p-6 space-y-6 bg-transparent">
      {/* Başlık */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-md font-extrabold tracking-tight text-foreground lg:text-3xl">
          Genel Yönetim Paneli
        </h1>
        <p className="text-lg text-foreground/70 font-medium">
          İşletmenizin güncel durumunu buradan takip edebilirsiniz.
        </p>
      </div>

      {/* Üst Kartlar */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Bu Ay Kazanç"
          value={`${stats.totalIncome} ₺`}
          icon={<TrendingUp className="h-6 w-6 text-emerald-400" />}
          // Koyu temada hafif bir yeşil parlaması ekler
          className="border-emerald-500/20 bg-emerald-500/5 shadow-sm shadow-emerald-500/10"
          trend="up"
        />

        <StatCard
          title="Bu Ay Gider"
          value={`${stats.totalExpense || "1000"} ₺`}
          icon={<Wallet className="h-6 w-6 text-rose-500" />}
          // Giderler için hafif kırmızı tonu
          className="border-rose-500/20 bg-rose-500/5 shadow-sm shadow-rose-500/10"
          trend="down"
        />

        <StatCard
          title="Toplam Çalışan"
          value={stats.userStats.totalUsers.toString()}
          icon={<Users className="h-6 w-6 text-blue-400" />}
          className="border-blue-500/20 bg-blue-500/5 shadow-sm shadow-blue-500/10"
        />

        <StatCard
          title="En Çok Satılan"
          value={stats.topFood.name}
          subValue={`${stats.topFood.count} Adet Satıldı`}
          icon={<Receipt className="h-6 w-6 text-orange-400" />}
          className="border-orange-500/20 bg-orange-500/5 shadow-sm shadow-orange-500/10"
        />
      </div>

      {/* Grafik Kartı */}
      <Card className="border border-border/50 shadow-2xl bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            Aylık Satış Analizi
          </CardTitle>
          <p className="text-sm text-muted-foreground ml-12">
            Son 30 günlük satış performansınız
          </p>
        </CardHeader>

        <CardContent className="h-[400px] w-full pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.monthlySalesChart}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              {/* Grid çizgilerini çok daha hafiflettik ki grafik öne çıksın */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--muted-foreground)/0.15)"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--foreground)/0.6)", fontSize: 13, fontWeight: 500 }}
                dy={15}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                // Yüzde yüz beyaz yerine hafif kırık ama parlak bir renk (Sayıları öne çıkarır)
                tick={{ fill: "hsl(var(--foreground))", fontSize: 14, fontWeight: "600" }}
                // Rakamların genişliğine göre alanı ayarlar (Böylece sayılar kesilmez)
                width={60}
                tickFormatter={(value) => `${value}₺`}
              />

              <Tooltip
                cursor={{ stroke: "hsl(var(--primary)/0.2)", strokeWidth: 2 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5)",
                  padding: "12px"
                }}
                itemStyle={{
                  color: "hsl(var(--primary))",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  marginBottom: "4px",
                  fontWeight: "semibold"
                }}
              />

              <Line
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={4} // Çizgiyi kalınlaştırdık
                dot={{
                  r: 5,
                  fill: "hsl(var(--card))", // Nokta içini kart rengi yaparak "hollow" efekti verdik
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 8,
                  fill: "hsl(var(--primary))",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
                animationDuration={1500}
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