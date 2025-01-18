import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateEventButton = () => {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState("");
  const [timeOfEvent, setTimeOfEvent] = useState("");
  const [endOfEvent, setEndOfEvent] = useState("");
  const [description, setDescription] = useState("");
  const [interestOptions, setInterestOptions] = useState([]);
  const [interestId, setInterestId] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get(
          "https://sharingcafe-be.onrender.com/api/interests/parent"
        );
        setInterestOptions(response.data);
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    fetchInterests();
  }, []);

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert("Vui lòng chọn một file ảnh.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("background_img", imageFile);

    try {
      const response = await axios.post(
        "https://sharingcafe-be.onrender.com/api/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.background_img; // Trả về URL ảnh từ API
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Có lỗi xảy ra khi tải ảnh lên.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Chuyển phút sang milliseconds
    const localISOTime = new Date(now.getTime() - offset).toISOString();
    return localISOTime.slice(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const startTime = new Date(timeOfEvent);
    const endTime = new Date(endOfEvent);

    // Kiểm tra nếu thời gian bắt đầu ở quá khứ
    if (startTime < now) {
      alert("Thời gian bắt đầu không thể ở quá khứ.");
      return;
    }

    // Kiểm tra nếu thời gian kết thúc trước hoặc bằng thời gian bắt đầu
    if (endTime <= startTime) {
      alert("Thời gian kết thúc phải sau thời gian bắt đầu.");
      return;
    }

    if (
      !title ||
      !interestId ||
      !imageFile ||
      !location ||
      !timeOfEvent ||
      !endOfEvent ||
      !description
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setIsSubmitting(true);

    try {
      const backgroundImg = await handleImageUpload();

      const eventData = {
        organizer_id: userId,
        interest_id: interestId,
        title,
        background_img: backgroundImg,
        location,
        time_of_event: timeOfEvent,
        end_of_event: endOfEvent,
        description,
        is_approve: true,
      };

      const response = await axios.post(
        "https://sharingcafe-be.onrender.com/api/event",
        eventData
      );
      console.log("Event created successfully:", response.data);
      alert("Event đã được tạo thành công!");

      // Reset form
      setTitle("");
      setImageFile(null);
      setLocation("");
      setTimeOfEvent("");
      setEndOfEvent("");
      setDescription("");
      setInterestId("");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Tạo Event Mới
      </h2>
      <form onSubmit={handleSubmit} className="text-black">
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="interest"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Lĩnh vực Quan Tâm
          </label>
          <select
            id="interest"
            value={interestId}
            onChange={(e) => setInterestId(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">Chọn lĩnh vực</option>
            {interestOptions.map((interest) => (
              <option key={interest.interest_id} value={interest.interest_id}>
                {interest.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Địa điểm
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="timeOfEvent"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Thời gian bắt đầu
          </label>
          <input
            type="datetime-local"
            id="timeOfEvent"
            value={timeOfEvent}
            onChange={(e) => setTimeOfEvent(e.target.value)}
            min={new Date().toISOString().slice(0, 16)} // Giới hạn thời gian bắt đầu không ở quá khứ
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="endOfEvent"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Thời gian kết thúc
          </label>
          <input
            type="datetime-local"
            id="endOfEvent"
            value={endOfEvent}
            onChange={(e) => setEndOfEvent(e.target.value)}
            min={timeOfEvent} // Giới hạn thời gian kết thúc phải sau thời gian bắt đầu
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mô tả
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
            rows="4"
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="imageFile"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Hình ảnh
          </label>
          <input
            type="file"
            id="imageFile"
            onChange={(e) => setImageFile(e.target.files[0])}
            accept="image/*"
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className={`w-full p-3 text-white rounded-md ${
            isSubmitting || isUploading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {isSubmitting || isUploading ? "Đang xử lý..." : "Tạo Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEventButton;
