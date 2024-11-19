import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "../../components/common/StatCard";
import {
  BarChart2,
  ShoppingBag,
  Users,
  Zap,
  Newspaper,
  Ticket,
  CalendarDays,
} from "lucide-react";
import SalesOverviewChart from "../../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../../components/overview/SalesChannelChart";
import Header from "../../components/common/Header";

const OverviewPage = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://sharingcafe-be.onrender.com/api/admin/statics"
        );
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Trang chủ" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {stats.map((stat) => {
            if (
              stat.entity_type === "Account" ||
              stat.entity_type === "Schedule" ||
              stat.entity_type === "Event" ||
              stat.entity_type === "Blog"
            ) {
              let icon;
              let color;
              let name;

              // Đặt tên tiếng Việt và xác định màu sắc và biểu tượng dựa trên entity_type
              switch (stat.entity_type) {
                case "Account":
                  name = "Tài khoản";
                  icon = Users;
                  color = "#6366f1"; // xanh dương
                  break;
                case "Schedule":
                  name = "Lịch hẹn";
                  icon = CalendarDays;
                  color = "#8B5CF6"; // tím
                  break;
                case "Event":
                  name = "Sự kiện";
                  icon = Ticket;
                  color = "#EC4899"; // hồng
                  break;
                case "Blog":
                  name = "Bài viết";
                  icon = Newspaper;
                  color = "#10B981"; // xanh lá
                  break;
                default:
                  name = "Tài khoản";
                  icon = Users;
                  color = "#6366f1";
              }

              return (
                <StatCard
                  key={stat.entity_type}
                  name={name}
                  icon={icon}
                  value={stat.entity_count}
                  color={color}
                />
              );
            }
            return null;
          })}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
