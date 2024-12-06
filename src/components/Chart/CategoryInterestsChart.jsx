import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryInterestsChart = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No authentication token found.");
          return;
        }

        const response = await axios.get("https://sharingcafe-be.onrender.com/api/admin/users", {
          headers: {
            Authorization: `${token}`
          }
        });

        const users = response.data;

        // Thống kê số lần xuất hiện của từng interest_name
        const interestStats = {};
        users.forEach(user => {
          user.interest_list.forEach(interest => {
            if (interestStats[interest.interest_name]) {
              interestStats[interest.interest_name]++;
            } else {
              interestStats[interest.interest_name] = 1;
            }
          });
        });

        // Chuyển đổi đối tượng thống kê thành mảng và sắp xếp theo số lượng giảm dần
        const sortedData = Object.entries(interestStats)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10); // Lấy 10 mục nhiều nhất

        setCategoryData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Tỉ lệ sở thích được quan tâm
      </h2>
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={categoryData}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryInterestsChart;
