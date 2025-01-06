import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateBlogButton = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
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
      alert("Please select an image file.");
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
      return response.data.background_img;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("There was an error uploading the image.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content || !title || !interestId || !imageFile) {
      alert("Please fill in all fields and select an image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrl = await handleImageUpload();
      const blogData = {
        user_id: userId,
        interest_id: interestId,
        content,
        title,
        image: imageUrl,
        is_approve: true,
      };

      const response = await axios.post(
        "https://sharingcafe-be.onrender.com/api/blog",
        blogData
      );
      console.log("Blog created successfully:", response.data);
      alert("Blog created successfully!");

      setContent("");
      setTitle("");
      setImageFile(null);
      setInterestId("");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("There was an error creating the blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 text-black rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Tạo Bài Viết Mới
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tiêu đề bài viết"
          />
        </div>

        <div>
          <label
            htmlFor="interest"
            className="block text-sm font-medium text-gray-700"
          >
            Chủ đề quan tâm
          </label>
          <select
            id="interest"
            value={interestId}
            onChange={(e) => setInterestId(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn chủ đề cho bài viết</option>
            {interestOptions.map((interest) => (
              <option key={interest.interest_id} value={interest.interest_id}>
                {interest.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Nội dung
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            placeholder="Nhập nội dung của bạn ở đây..."
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="imageFile"
            className="block text-sm font-medium text-gray-700"
          >
            Tải ảnh
          </label>
          <input
            type="file"
            id="imageFile"
            onChange={(e) => setImageFile(e.target.files[0])}
            accept="image/*"
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className={`w-full py-3 font-bold rounded-lg transition-colors text-white ${
            isSubmitting || isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting || isUploading ? "Đang tạo..." : "Tạo bài viết"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogButton;
