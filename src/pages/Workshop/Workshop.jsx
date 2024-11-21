import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

import { Calendar, CalendarCheck } from "lucide-react";

import axios from "axios";
import EventsTable from "../../components/Events/EventsTable";

const Workshop = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [newEventsCount, setNewEventsCount] = useState(0);

  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        const response = await axios.get(
          "https://sharingcafe-be.onrender.com/api/event"
        );
        const events = response.data.events;

        // Tổng số sự kiện
        setTotalEvents(events.length);

        // Tính số sự kiện mới trong tuần
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const newEvents = events.filter(
          (event) => new Date(event.createdAt) >= oneWeekAgo
        );
        setNewEventsCount(newEvents.length);
      } catch (error) {
        console.error("Error fetching event stats: ", error);
      }
    };

    fetchEventStats();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Sự kiện" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tổng sự kiện"
            icon={Calendar}
            value={totalEvents}
            color="#6366F1"
          />
          <StatCard
            name="Sự kiện mới"
            icon={CalendarCheck}
            value={newEventsCount}
            color="#10B981"
          />
        </motion.div>

        <EventsTable />

        {/* CHARTS */}
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          {/* Có thể thêm biểu đồ tại đây */}
        </div>
      </main>
    </div>
  );
};

export default Workshop;
