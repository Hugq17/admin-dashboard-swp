import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateBlogButton = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null); // State lưu tệp ảnh
  const [interestOptions, setInterestOptions] = useState([]);
  const [interestId, setInterestId] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Trạng thái tải ảnh

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

  // Hàm xử lý tải ảnh lên API
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

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content || !title || !interestId || !imageFile) {
      alert("Vui lòng điền đầy đủ thông tin và chọn file ảnh.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Tải ảnh lên trước
      const imageUrl = await handleImageUpload();

      // Dữ liệu blog cần gửi
      const blogData = {
        user_id: userId,
        interest_id: interestId,
        content: content,
        title: title,
        image: imageUrl,
        is_approve: true,
      };

      // Gửi dữ liệu blog
      const response = await axios.post(
        "https://sharingcafe-be.onrender.com/api/blog",
        blogData
      );
      console.log("Blog created successfully:", response.data);
      alert("Blog đã được tạo thành công!");

      // Reset form
      setContent("");
      setTitle("");
      setImageFile(null);
      setInterestId("");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Tạo Blog Mới
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
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nội dung
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          {isSubmitting || isUploading ? "Đang xử lý..." : "Tạo Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogButton;
