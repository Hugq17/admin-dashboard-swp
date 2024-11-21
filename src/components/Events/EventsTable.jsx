import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

const EventsTable = () => {
  const [events, setEvents] = useState([]); // All events from the API
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered events based on search
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [eventsPerPage] = useState(5); // Number of events per page

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://sharingcafe-be.onrender.com/api/event"
        );
        setEvents(response.data); // Set events in state
        setFilteredEvents(response.data); // Initialize filtered events as the full list initially
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Filter events when search query or events list changes
  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  // Get current events based on pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-6">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-center">Ngày tổ chức</th>
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
