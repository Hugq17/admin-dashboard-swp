import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import CreateBlogButton from "./CreateBlogButton";

const BlogsTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://sharingcafe-be.onrender.com/api/blog"
        );
        setBlogs(response.data);
        setFilteredBlogs(response.data);
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

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open or close modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-8 relative">
            {/* Close Button */}
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            {/* Content inside Modal */}
            <CreateBlogButton />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {/* Button to open Modal */}
        <div className="mb-6 text-center">
          <button
            onClick={toggleModal}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Tạo Blog
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-center">Ngày tạo</th>
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

      {/* Pagination */}
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
