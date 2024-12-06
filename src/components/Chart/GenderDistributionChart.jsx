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

// Màu sắc cho từng phần biểu đồ
const COLORS = ["#6366F1", "#EC4899"];

const GenderDistributionChart = () => {
  const [genderData, setGenderData] = useState([]);
  const [error, setError] = useState(null);

  // Hàm gọi API để lấy dữ liệu
  const fetchGenderData = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
      const response = await fetch(
        "https://sharingcafe-be.onrender.com/api/admin/users",
        {
          headers: {
            Authorization: `${token}`, // Thêm Authentication Header
          },
        }
      );
      const data = await response.json();

      // Tính số lượng Nam và Nữ
      const maleCount = data.filter((user) => user.gender === "Nam").length;
      const femaleCount = data.filter((user) => user.gender === "Nữ").length;

      // Định dạng dữ liệu để hiển thị trên biểu đồ
      setGenderData([
        { name: "Nam", value: maleCount },
        { name: "Nữ", value: femaleCount },
      ]);
    } catch (err) {
      setError("Lỗi khi lấy dữ liệu từ API");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGenderData(); // Gọi API khi component được mount
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Tỉ lệ giới tính
      </h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <PieChart>
              <Pie
                data={genderData}
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
                {genderData.map((entry, index) => (
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
      )}
    </motion.div>
  );
};

export default GenderDistributionChart;

