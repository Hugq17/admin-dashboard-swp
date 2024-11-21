import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

const BlogsTable = () => {
  const [blogs, setBlogs] = useState([]); // All blogs from the API
  const [filteredBlogs, setFilteredBlogs] = useState([]); // Filtered blogs based on search
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [blogsPerPage] = useState(5); // Number of blogs per page

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://sharingcafe-be.onrender.com/api/blog"
        );
        setBlogs(response.data); // Set blogs in state
        setFilteredBlogs(response.data); // Initialize filtered blogs as the full list initially
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs when search query or blogs list changes
  useEffect(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);

  // Get current blogs based on pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-6">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-center">Ngày tạo</th>
              <th className="px-6 py-4 text-center">Hình ảnh</th>
              <th className="px-6 py-4 text-left">Tiêu đề</th>
              <th className="px-6 py-4 text-left">Tác giả</th>
              <th className="px-6 py-4 text-left">Nội dung</th>
              <th className="px-6 py-4 text-center">Lượt thích</th>
              <th className="px-6 py-4 text-center">Lượt bình luận</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentBlogs.map((blog) => (
              <tr key={blog.blog_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(blog.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-center">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-16 h-16 object-cover rounded-full mx-auto"
                  />
                </td>
                <td className="px-6 py-4">{blog.title}</td>
                <td className="px-6 py-4">{blog.user_name}</td>
                <td className="px-6 py-4 max-w-xs relative group">
                  {/* Phần mô tả mặc định */}
                  <div className="truncate">{blog.content}</div>

                  {/* Hiển thị nội dung đầy đủ khi hover */}
                  <div className="absolute hidden group-hover:flex bg-gray-800 text-white text-sm rounded-lg shadow-md px-4 py-2 z-10 w-max max-w-xs">
                    {blog.content}
                  </div>
                </td>

                <td className="px-6 py-4 text-center">{blog.likes_count}</td>
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
