import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const BlogStatics = () => {
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://sharingcafe-be.onrender.com/api/admin/blog-statics"
        );
        const data = await response.json();

        // Chuyển event_year thành số và format dữ liệu
        const formattedData = data.map((item) => ({
          name: `${item.blog_month}/${item.blog_year}`,
          blogs: Math.max(0, Math.round(parseFloat(item.blog_count))) || 0, // Làm tròn và loại bỏ số âm
          year: parseInt(item.blog_year, 10), // Parse năm thành số
        }));

        // Lấy các năm duy nhất
        const uniqueYears = [
          ...new Set(formattedData.map((item) => item.year)),
        ];
        setYears(uniqueYears);

        // Cập nhật dữ liệu
        setChartData(formattedData);
        setFilteredData(formattedData); // Mặc định hiển thị tất cả dữ liệu
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Lọc dữ liệu theo năm đã chọn
  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10); // Chuyển giá trị năm thành số
    setSelectedYear(year);

    // Lọc dữ liệu theo năm đã chọn
    const filtered = chartData.filter((item) => item.year === year);
    setFilteredData(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Số bài viết theo năm
      </h2>

      {/* Dropdown để chọn năm */}
      <div className="mb-4">
        <select
          className="bg-gray-700 text-gray-100 p-2 rounded-lg"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">Chọn năm</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            {/* Trục X với labelFormatter để chỉ hiển thị số nguyên */}
            <XAxis
              dataKey={"name"}
              stroke="#9ca3af"
              tickFormatter={(value) => value.split("/")[0]} // Hiển thị chỉ tháng
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              labelFormatter={(value) => `Tháng: ${value}`}
              formatter={(value, name) => {
                if (name === "blogs") {
                  return ["Số bài viết", value]; // Hiển thị số bài viết
                }
                return [name, value];
              }}
            />
            {/* Dữ liệu thực tế */}
            <Line
              type="monotone"
              dataKey="blogs" // "blogs" cho dữ liệu bài viết
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default BlogStatics;
