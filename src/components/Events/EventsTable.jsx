import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import CreateEventButton from "./CreateEventButton";
import { motion } from "framer-motion";
import StatCard from "../../components/common/StatCard";
import { BookOpen, BookOpenCheck } from "lucide-react";

const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todayEventsCount, setTodayEventsCount] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc"); // Thứ tự sắp xếp

  const getTodayDate = () => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    return startOfToday.toISOString();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://sharingcafe-be.onrender.com/api/event"
        );
        setEvents(response.data);
        setFilteredEvents(response.data);

        const todayDate = getTodayDate();
        const todayEvents = response.data.filter(
          (event) => new Date(event.created_at) >= new Date(todayDate)
        );
        setTodayEventsCount(todayEvents.length);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const sortEventsByDate = () => {
    const sorted = [...filteredEvents].sort((a, b) => {
      const dateA = new Date(a.time_of_event);
      const dateB = new Date(b.time_of_event);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredEvents(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-6">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-8 relative">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <CreateEventButton />
          </div>
        </div>
      )}
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <StatCard
          name="Tổng workshop"
          icon={BookOpen}
          value={events.length}
          color="#6366F1"
        />
        <StatCard
          name="Workshop mới hôm nay"
          icon={BookOpenCheck}
          value={todayEventsCount}
          color="#10B981"
        />
      </motion.div>
      <div className="flex justify-between items-center">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button
          onClick={toggleModal}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Tạo Workshop
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th
                className="px-6 py-4 text-center cursor-pointer"
                onClick={sortEventsByDate}
              >
                Ngày tổ chức
                {sortOrder === "asc" ? " ▲" : " ▼"}
              </th>
              <th className="px-6 py-4 text-center">Hình ảnh</th>
              <th className="px-6 py-4 text-left">Tiêu đề</th>
              <th className="px-6 py-4 text-left">Người tổ chức</th>
              <th className="px-6 py-4 text-left">Mô tả</th>
              <th className="px-6 py-4 text-center">Số người tham gia</th>
              <th className="px-6 py-4 text-center">Địa điểm</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentEvents.map((event) => (
              <tr key={event.event_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(event.time_of_event).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-center">
                  <img
                    src={event.background_img}
                    alt={event.title}
                    className="w-16 h-16 object-cover rounded-full mx-auto"
                  />
                </td>
                <td className="px-6 py-4">{event.title}</td>
                <td className="px-6 py-4">{event.user_name}</td>
                <td className="px-6 py-4 max-w-xs relative group">
                  <div className="truncate">{event.description}</div>
                  <div
                    className="absolute hidden group-hover:flex bg-gray-800 text-white text-sm rounded-lg shadow-md px-4 py-2 z-10 w-max max-w-xs"
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    {event.description}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {event.participants_count}
                </td>
                <td className="px-6 py-4 text-center">{event.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={filteredEvents.length}
        itemsPerPage={eventsPerPage}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default EventsTable;
