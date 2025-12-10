import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { TrendingUp, Users, Receipt, Wallet } from "lucide-react";
import { API_PATHS } from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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

  if (!stats) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="p-6 space-y-6">

      {/* Başlık */}
      <h1 className="text-2xl font-semibold text-gray-800">Genel Yönetim Paneli</h1>

      {/* Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Kazanç */}
        <div className="bg-white/80 backdrop-blur shadow-lg rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-500 text-sm">Bu Ay Kazanç</h2>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{stats.totalIncome} ₺</div>
        </div>

        {/* Gider */}
        <div className="bg-white/80 backdrop-blur shadow-lg rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-500 text-sm">Bu Ay Gider</h2>
            <Wallet className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{stats.totalExpense || "1000"} ₺</div>
        </div>

        {/* Çalışan */}
        <div className="bg-white/80 backdrop-blur shadow-lg rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-500 text-sm">Toplam Çalışan</h2>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{stats.userStats.totalUsers}</div>
        </div>

        {/* En çok satılan ürün */}
        <div className="bg-white/80 backdrop-blur shadow-lg rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-500 text-sm">En Çok Satılan</h2>
            <Receipt className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-xl font-semibold mt-2">{stats.topFood.name}</div>
          <div className="text-sm text-gray-500">{stats.topFood.count} adet</div>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur border border-gray-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Aylık Satış Grafiği
          </CardTitle>
        </CardHeader>

        <CardContent className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthlySalesChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}