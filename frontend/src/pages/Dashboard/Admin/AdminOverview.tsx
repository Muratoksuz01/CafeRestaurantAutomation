import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { TrendingUp, Users, Receipt, Wallet } from "lucide-react";
import { API_PATHS } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

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
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Genel Yönetim Paneli</h1>
        <p className="text-muted-foreground">İşletmenizin güncel durumunu buradan takip edebilirsiniz.</p>
      </div>

      {/* Üst Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Bu Ay Kazanç"
          value={`${stats.totalIncome} ₺`}
          icon={<TrendingUp className="text-emerald-500" />}
          trend="up"
        />
        <StatCard
          title="Bu Ay Gider"
          value={`${stats.totalExpense || "1000"} ₺`}
          icon={<Wallet className="text-destructive" />}
          trend="down"
        />
        <StatCard
          title="Toplam Çalışan"
          value={stats.userStats.totalUsers.toString()}
          icon={<Users className="text-blue-500" />}
        />
        <StatCard
          title="En Çok Satılan"
          value={stats.topFood.name}
          subValue={`${stats.topFood.count} adet`}
          icon={<Receipt className="text-primary" />}
        />
      </div>

      {/* Grafik Kartı */}
      <Card className="border border-border/50 shadow-xl bg-background/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5 text-primary" />
            Aylık Satış Analizi
          </CardTitle>
        </CardHeader>

        <CardContent className="h-[350px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.monthlySalesChart}
              margin={{ top: 5, right: 24, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                // tick rengini --muted-foreground (gri tonu) olarak güncelledik
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                // Yazıların okunabilirliği için direkt oklch değerini veya doğru değişkeni veriyoruz
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)", // CSS'deki --card rengini kullanır
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                }}
                itemStyle={{ color: "var(--primary)" }} // Değerlerin rengi senin lila/mavi tonun olur
                labelStyle={{ color: "var(--muted-foreground)" }}
              />

              <Line
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "hsl(var(--background))",
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: "hsl(var(--primary))",
                }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


    </div>
  );
}

// Küçük Yardımcı Bileşen: StatCard
function StatCard({ title, value, subValue, icon, trend }: any) {
  return (
    <Card className="border-none shadow-lg bg-card/60 backdrop-blur-sm transition-all hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="p-2 bg-muted rounded-lg">{icon}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
          {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
        </div>
      </CardContent>
    </Card>
  );
}