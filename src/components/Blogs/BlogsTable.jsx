import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import CreateBlogButton from "./CreateBlogButton";
import StatCard from "../../components/common/StatCard";
import { BookOpen, BookOpenCheck } from "lucide-react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

const BlogsTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todayBlogsCount, setTodayBlogsCount] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc"); // Trạng thái sắp xếp

  const totalBlogsCount = blogs.length;

  // Lấy ngày hiện tại
  const getTodayDate = () => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    return startOfToday.toISOString();
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://sharingcafe-be.onrender.com/api/blog"
        );
        setBlogs(response.data);
        setFilteredBlogs(response.data);

        // Lọc các bài viết được tạo hôm nay
        const todayDate = getTodayDate();
        const todayBlogs = response.data.filter(
          (blog) => new Date(blog.created_at) >= new Date(todayDate)
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

  // Hàm sắp xếp
  const sortBlogs = () => {
    const sortedBlogs = [...filteredBlogs].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredBlogs(sortedBlogs);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Modal */}
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
            Tạo Blog
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-600">
            <tr className="border-b hover:bg-gray-100 transition duration-300 ease-in-out">
              <th className="px-6 py-4 text-center flex items-center justify-center">
                Ngày tạo
                <button
                  onClick={sortBlogs}
                  className="ml-2 text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                </button>
              </th>
              <th className="px-6 py-4 text-center">Hình ảnh</th>
              <th className="px-6 py-4 text-left">Tiêu đề</th>
              <th className="px-6 py-4 text-left">Tác giả</th>
              <th className="px-6 py-4 text-left">Nội dung</th>
              <th className="px-6 py-4 text-center">Chủ đề</th>
              <th className="px-6 py-4 text-center">Lượt bình luận</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {currentBlogs.map((blog) => (
              <tr
                key={blog.blog_id}
                className="border-b hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(blog.created_at).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="px-6 py-4 text-center">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4">{blog.title}</td>
                <td className="px-6 py-4">{blog.user_name}</td>
                <td className="px-6 py-4 max-w-xs relative group">
                  <div className="truncate">{blog.content}</div>
                  <div className="absolute hidden group-hover:flex bg-gray-800 text-white text-sm rounded-lg shadow-md px-4 py-2 z-10 w-max max-w-xs">
                    {blog.content}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">{blog.interest_name}</td>
                <td className="px-6 py-4 text-center">{blog.comments_count}</td>
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
    </div>
  );
};

export default BlogsTable;
