import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const SalesChannelChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
  
        if (!token) {
          console.error("No access token found!");
          return;
        }
  
        const response = await fetch(
          "https://sharingcafe-be.onrender.com/api/admin/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`, // Thêm Bearer token vào header
            },
          }
        );
  
        if (!response.ok) {
          console.error("Failed to fetch data:", response.status, response.statusText);
          return;
        }
  
        // Chuyển đổi phản hồi thành JSON
        const data = await response.json();
  
        console.log("API Response:", data); // Log dữ liệu trả về để kiểm tra
  
        // Kiểm tra nếu dữ liệu trả về là mảng
        if (Array.isArray(data)) {
          // Xử lý dữ liệu: đếm số người theo từng tỉnh
          const provinceCount = {};
          data.forEach((user) => {
            const province = user.province || "Không xác định";
            provinceCount[province] = (provinceCount[province] || 0) + 1;
          });
  
          // Chuyển dữ liệu thành mảng để hiển thị trên biểu đồ
          const processedData = Object.keys(provinceCount).map((province) => ({
            name: province,
            value: provinceCount[province],
          }));
  
          setChartData(processedData);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Số người dùng theo tỉnh
      </h2>
      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey={"value"} fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesChannelChart;
