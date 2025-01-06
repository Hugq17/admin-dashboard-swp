import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import CreateBlogButton from "./CreateBlogButton";
import StatCard from "../../components/common/StatCard";
import { BookOpen, BookOpenCheck } from "lucide-react";
import { motion } from "framer-motion";

const BlogsTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [todayBlogsCount, setTodayBlogsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://sharingcafe-be.onrender.com/api/blog"
        );
        setBlogs(response.data);
        setFilteredBlogs(response.data);

        const todayDate = new Date().setHours(0, 0, 0, 0);
        const todayBlogs = response.data.filter(
          (blog) => new Date(blog.created_at).getTime() >= todayDate
        );
        setTodayBlogsCount(todayBlogs.length);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handleShowDetails = (blog) => {
    setSelectedBlog(blog);
  };

  const closeDetails = () => {
    setSelectedBlog(null);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

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
            <CreateBlogButton />
          </div>
        </div>
      )}
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatCard
          name="Tổng bài viết"
          icon={BookOpen}
          value={blogs.length}
          color="#6366F1"
        />
        <StatCard
          name="Bài viết mới hôm nay"
          icon={BookOpenCheck}
          value={todayBlogsCount}
          color="#10B981"
        />
      </motion.div>

      <div className="flex justify-between items-center mb-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex gap-4">
          <button
            onClick={toggleModal}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Tạo Bài Viết
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md text-black">
        <table className="table-fixed w-full">
          <thead className="bg-gray-100 text-gray-600">
            <tr className="border-b">
              <th className="px-6 py-4 text-center">Ngày tạo</th>
              <th className="px-6 py-4 text-center">Hình ảnh</th>
              <th className="px-6 py-4 text-left">Tiêu đề</th>
              <th className="px-6 py-4 text-left">Tác giả</th>
              <th className="px-6 py-4 text-left">Chủ đề</th>
              <th className="px-6 py-4 text-center">Lượt bình luận</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.map((blog) => (
              <tr
                key={blog.blog_id}
                className="border-b hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                <td className="px-6 py-4 text-center">
                  {new Date(blog.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-center">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-12 h-12 object-cover rounded-md mx-auto"
                  />
                </td>
                <td className="px-6 py-4 truncate">{blog.title}</td>
                <td className="px-6 py-4">{blog.user_name}</td>
                <td className="px-6 py-4">{blog.interest_name}</td>
                <td className="px-6 py-4 text-center">{blog.comments_count}</td>
                <td
                  className={`px-6 py-4 text-center ${
                    blog.is_visible
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }`}
                >
                  {blog.is_visible ? "Hiển thị" : "Ẩn"}
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleShowDetails(blog)}
                    className="text-blue-500 hover:underline"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredBlogs.length}
        itemsPerPage={blogsPerPage}
        paginate={paginate}
        currentPage={currentPage}
      />

      {/* Modal chi tiết bài viết */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Chi tiết bài viết</h2>
            <p>
              <strong>Tiêu đề:</strong> {selectedBlog.title}
            </p>
            <p>
              <strong>Tác giả:</strong> {selectedBlog.user_name}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(selectedBlog.created_at).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Chủ đề:</strong> {selectedBlog.interest_name}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span
                className={
                  selectedBlog.is_visible
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {selectedBlog.is_visible ? "Hiển thị" : "Ẩn"}
              </span>
            </p>

            <p>
              <strong>Nội dung:</strong> {selectedBlog.content}
            </p>

            <button
              onClick={closeDetails}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsTable;
