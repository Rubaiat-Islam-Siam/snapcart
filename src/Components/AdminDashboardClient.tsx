"use client";
import { motion } from "framer-motion";
import { Package, Truck, User } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

type Props = {
  earnings: {
    today: number;
    sevenDays: number;
    total: number;
  };
  stats: {
    title: string;
    value: number;
  }[];
  chartdata: {
    date: string;
    orders: number;
  }[];
};

function AdminDashboardClient({ earnings, stats, chartdata }: Props) {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">(
    "today"
  );

  const currentEarnings =
    filter === "today"
      ? earnings.today
      : filter === "sevenDays"
      ? earnings.sevenDays
      : earnings.total;

  const title =
    filter === "today"
      ? "Today's Earnings"
      : filter === "sevenDays"
      ? "Last 7 Days Earnings"
      : "Total Earnings";

  return (
    <div className="pt-28 pb-20 w-[90%] md:w-[85%] mx-auto space-y-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-green-700"
        >
          🏪 Admin Dashboard
        </motion.h1>

        <select
          className="bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "today" | "sevenDays" | "total")
          }
        >
          <option value="today">Today</option>
          <option value="sevenDays">Last 7 Days</option>
          <option value="total">Total</option>
        </select>
      </div>

      {/* EARNINGS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-8 shadow-xl text-center"
      >
        <h2 className="text-lg font-medium opacity-90 mb-3">{title}</h2>
        <p className="text-5xl font-bold">
          {currentEarnings.toLocaleString("en-BD", {
            style: "currency",
            currency: "BDT",
            maximumFractionDigits: 0,
          })}
        </p>
      </motion.div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const icons = [
            <Package key="p" className="text-green-600" size={26} />,
            <User key="u" className="text-green-600" size={26} />,
            <Truck key="t" className="text-green-600" size={26} />,
            <Package key="b" className="text-green-600" size={26} />,
          ];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-xl transition"
            >
              <div className="bg-green-100 p-3 rounded-xl">
                {icons[index]}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-gray-800 font-bold text-2xl">
                  {stat.value.toLocaleString("en-BD")}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CHART */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          📈 Orders Overview (Last 7 Days)
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartdata}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="orders"
              fill="#16a34a"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboardClient;