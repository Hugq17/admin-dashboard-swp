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
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedEvent, setSelectedEvent] = useState(null); // Lưu thông tin sự kiện được chọn
  // Các state mới
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    description: "",
    time_of_event: "",
    location: "",
    background_img: "",
  });
  const [eventImageFile, setEventImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [participants, setParticipants] = useState([]);

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventImageUpload = async () => {
    if (!eventImageFile) {
      alert("Please select an image file.");
      return null;
    }

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("background_img", eventImageFile);

    try {
      const response = await axios.post(
        "https://sharingcafe-be.onrender.com/api/image",
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Đường dẫn ảnh upload:", response.data.background_img);
      alert("Image uploaded successfully!");
      return response.data.background_img;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("There was an error uploading the image.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const openUpdateModal = (event) => {
    setSelectedEvent(event);
    setUpdateFormData({
      title: event.title,
      description: event.description,
      time_of_event: event.time_of_event,
      location: event.location,
      background_img: event.background_img,
    });
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedEvent(null);
    setEventImageFile(null); // Reset file chọn
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      let imageUrl = updateFormData.background_img;

      // Nếu có file ảnh mới, tiến hành upload và lấy URL mới
      if (eventImageFile) {
        const uploadedImageUrl = await handleEventImageUpload();
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      // Tạo dữ liệu cập nhật với trường background_img mới
      const updatedData = {
        ...updateFormData,
        background_img: imageUrl,
      };

      await axios.put(
        `https://sharingcafe-be.onrender.com/api/event/${selectedEvent.event_id}`,
        updatedData
      );
      alert("Cập nhật sự kiện thành công!");
      closeUpdateModal();
      // Tùy chọn: Cập nhật lại danh sách sự kiện hoặc gọi fetchEvents() để làm mới dữ liệu từ server
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Có lỗi xảy ra khi cập nhật sự kiện.");
    }
  };

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

  const handleShowDetails = async (event) => {
    setSelectedEvent(event);
    try {
      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage hoặc nguồn khác
      const config = {
        headers: {
          Authorization: `${token}`, // Gửi token kèm theo
        },
      };

      const response = await axios.get(
        `https://sharingcafe-be.onrender.com/api/auth/user/event/event-participants?event_id=${event.event_id}`,
        config
      );
      setParticipants(response.data);
    } catch (err) {
      console.error("Error fetching participants:", err);
      alert("Có lỗi khi tải danh sách người tham gia.");
    }
  };

  const closeDetails = () => {
    setSelectedEvent(null);
    setParticipants([]);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event); // Lưu thông tin sự kiện được chọn vào state
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://sharingcafe-be.onrender.com/api/event"
        );
        // Kiểm tra response.data có phải là mảng không
        const eventsData = Array.isArray(response.data) ? response.data : [];

        setEvents(eventsData);
        setFilteredEvents(eventsData);

        const todayDate = getTodayDate();
        const todayEvents = eventsData.filter(
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
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center text-black">
          <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-8 relative">
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {selectedEvent.title}
              </h2>
              <p className="mb-2">
                <strong>Người tổ chức:</strong> {selectedEvent.user_name}
              </p>
              <p className="mb-2">
                <strong>Thời gian:</strong>{" "}
                {new Date(selectedEvent.time_of_event).toLocaleString("vi-VN")}
              </p>
              <p className="mb-2">
                <strong>Địa điểm:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Mô tả:</strong> {selectedEvent.description}
              </p>

              {/* Phần hiển thị danh sách người tham gia */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">
                  Danh sách người tham gia
                </h3>
                {participants && participants.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {participants.map((participant) => (
                      <div
                        key={participant.user_id}
                        className="flex items-center space-x-4 p-2 border rounded-md"
                      >
                        <img
                          src={participant.profile_avatar}
                          alt={participant.user_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="font-medium">
                          {participant.user_name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Không có người tham gia.</p>
                )}
              </div>
            </div>
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
      <div className="bg-white rounded-lg shadow-md">
        <table className="table-fixed w-full h-[600px]">
          <thead className="bg-gray-100 text-gray-600">
            <tr className="border-b">
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
              <th className="px-6 py-4 text-center">Chi tiết</th>
              <th className="px-6 py-4 text-center">Hành động</th>
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
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4">{event.title}</td>
                <td className="px-6 py-4">{event.user_name}</td>
                <td className="px-6 py-4 max-w-xs relative group">
                  <div className="truncate">{event.description}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  {event.participants_count}
                </td>
                <td className="px-6 py-4 text-center">{event.location}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleShowDetails(event)}
                    className="text-blue-500 hover:underline"
                  >
                    Xem chi tiết
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openUpdateModal(event)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Cập nhật
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-lg p-6 w-1/2">
            <h2 className="text-xl font-bold mb-4">Cập nhật sự kiện</h2>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Tiêu đề</label>
              <input
                type="text"
                name="title"
                value={updateFormData.title}
                onChange={handleUpdateInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Mô tả</label>
              <textarea
                name="description"
                value={updateFormData.description}
                onChange={handleUpdateInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows="6"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Thời gian tổ chức
              </label>
              <input
                type="datetime-local"
                name="time_of_event"
                value={new Date(updateFormData.time_of_event)
                  .toISOString()
                  .slice(0, 16)}
                onChange={handleUpdateInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Địa điểm</label>
              <input
                type="text"
                name="location"
                value={updateFormData.location}
                onChange={handleUpdateInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tải ảnh sự kiện mới
              </label>
              <input
                type="file"
                name="background_img"
                onChange={(e) => setEventImageFile(e.target.files[0])}
                accept="image/*"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeUpdateModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateEvent}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

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
