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
  const [averageLineData, setAverageLineData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://sharingcafe-be.onrender.com/api/admin/blog-statics"
        );
        const data = await response.json();

        // Format data
        const formattedData = data.map((item) => ({
          name: `${item.blog_month}/${item.blog_year}`,
          blogs: Math.max(0, Math.round(parseFloat(item.blog_count))) || 0,
          year: parseInt(item.blog_year, 10),
        }));

        // Get unique years
        const uniqueYears = [
          ...new Set(formattedData.map((item) => item.year)),
        ];
        setYears(uniqueYears);

        // Compute yearly average and round it to an integer
        const averages = uniqueYears.map((year) => {
          const yearData = formattedData.filter((item) => item.year === year);
          const totalBlogs = yearData.reduce(
            (sum, item) => sum + item.blogs,
            0
          );
          const average = Math.floor(totalBlogs / 12); // Round down to the nearest integer
          return { year, average };
        });

        setChartData(formattedData);
        setFilteredData(formattedData);
        setAverageLineData(averages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle year change
  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);

    const filtered = chartData.filter((item) => item.year === year);
    setFilteredData(filtered);
  };

  // Get the average value for the selected year
  const averageValue =
    averageLineData.find((avg) => avg.year === selectedYear)?.average || 0;

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

      {/* Dropdown */}
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
            <XAxis
              dataKey={"name"}
              stroke="#9ca3af"
              tickFormatter={(value) => value.split("/")[0]}
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
                  return [value, "Số bài viết"];
                }
                // Thêm điều kiện này để hiển thị Trung bình
                if (name === "averageLine") {
                  return [averageValue, "Trung bình"];
                }
                return [value, name];
              }}
            />

            {/* Blogs Data */}
            <Line
              type="monotone"
              dataKey="blogs"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
            {/* Average Line */}
            {selectedYear && (
              <Line
                type="monotone"
                dataKey={() => averageValue}
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="averageLine" // Gán tên cho đường trung bình
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default BlogStatics;
