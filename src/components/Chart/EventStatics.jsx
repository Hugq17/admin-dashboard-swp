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

const EventStatics = () => {
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [averageLineData, setAverageLineData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://sharingcafe-be.onrender.com/api/admin/event-statics"
        );
        const data = await response.json();

        const formattedData = data.map((item) => ({
          name: `${item.event_month}/${item.event_year}`, // Tên hiển thị trên trục X
          events: Math.max(0, Math.round(parseFloat(item.event_count))) || 0, // Số sự kiện
          year: parseInt(item.event_year, 10), // Năm
        }));

        const uniqueYears = [
          ...new Set(formattedData.map((item) => item.year)),
        ];
        setYears(uniqueYears);

        const averages = uniqueYears.map((year) => {
          const yearData = formattedData.filter((item) => item.year === year);
          const totalEvents = yearData.reduce(
            (sum, item) => sum + item.events,
            0
          );
          const average = Math.floor(totalEvents / 12);
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

  // dropdown chọn năm
  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);

    const filtered = chartData.filter((item) => item.year === year);
    setFilteredData(filtered);
  };
  // Tính giá trị trung bình
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
        Số Workshop theo năm
      </h2>

      {/* Dropdown chọn năm*/}
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
      {/*Biểu đồ*/}
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
                if (name === "Events") {
                  return [value, "Số bài viết"];
                }
                // Thêm điều kiện này để hiển thị Trung bình
                if (name === "averageLine") {
                  return [averageValue, "Trung bình"];
                }
                return [value, name];
              }}
            />

            {/* Data sự kiện*/}
            <Line
              type="monotone"
              dataKey="events"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
            {/* Line đường trung bình tính theo năm */}
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

export default EventStatics;
