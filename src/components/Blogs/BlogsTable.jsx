import { motion } from "framer-motion";
import { Edit, Search, Trash2, Plus, ArrowUpAz, ArrowDownZa, ArrowUp01, ArrowDown10 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import DeleteConfirmPopup from "./DeleteConfirmPopup";
import EditBlogPopup from "./EditBlogPopup";
import CreateBlogPopup from "./CreateBlogPopup";

const BlogsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "title", // Default sort by 'title'
    direction: "asc", // Default direction is ascending
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://sharingcafe-be.onrender.com/api/blog?page=1");
        setBlogs(response.data.blogs);
        setFilteredBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs: ", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = blogs.filter(
      (blog) => blog.title.toLowerCase().includes(term) || blog.authorName.toLowerCase().includes(term)
    );
    setFilteredBlogs(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (blog) => {
    setSelectedBlog(blog);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://sharingcafe-be.onrender.com/api/blog/${selectedBlog.id}`);
      setBlogs(blogs.filter((b) => b.id !== selectedBlog.id));
      setFilteredBlogs(filteredBlogs.filter((b) => b.id !== selectedBlog.id));
      setShowDeletePopup(false);
    } catch (error) {
      console.error("Error deleting blog: ", error);
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setShowEditPopup(true);
  };

  const saveEdit = async (updatedBlog) => {
    try {
      await axios.put(`https://koi-care-at-home-server-h3fyedfeeecdg7fh.southeastasia-01.azurewebsites.net/api/blogs/update/${updatedBlog.id}`, updatedBlog);
      setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
      setFilteredBlogs(filteredBlogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating blog: ", error);
    }
  };

  const handleCreate = () => {
    setShowCreatePopup(true);
  };

  const saveCreate = async (newBlog) => {
    try {
      const response = await axios.post("https://sharingcafe-be.onrender.com/api/blog", newBlog);
      setBlogs([response.data, ...blogs]);
      setFilteredBlogs([response.data, ...filteredBlogs]);
      setShowCreatePopup(false);
    } catch (error) {
      console.error("Error creating blog: ", error);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedBlogs = [...filteredBlogs].sort((a, b) => {
      if (key === "createdAt") {
        // Sort by date (ascending or descending)
        return direction === "asc" ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
      }

      // Default sorting for string-based keys (title, authorName)
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredBlogs(sortedBlogs);
  };

  const indexOfLastBlog = currentPage * postsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - postsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Danh sách bài viết</h2>
        <div className="flex items-center">
          <button onClick={handleCreate} className="flex items-center text-white bg-blue-500 px-4 py-2 rounded-lg mr-4 hover:bg-blue-600">
            <Plus size={18} className="mr-2" /> Tạo bài viết
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Tiêu đề
                {sortConfig.key === "title" && (
                  <span className="ml-2">
                    {sortConfig.direction === "asc" ? <ArrowUpAz size={16} /> : <ArrowDownZa size={16} />}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Nội dung</th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                Ngày tạo
                {sortConfig.key === "created_at" && (
                  <span className="ml-2">
                    {sortConfig.direction === "asc" ? <ArrowUp01 size={16} /> : <ArrowDown10 size={16} />}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap cursor-pointer"
                onClick={() => handleSort("user_name")}
              >
                Tác giả
                {sortConfig.key === "user_name" && (
                  <span className="ml-2">
                    {sortConfig.direction === "asc" ? <ArrowUpAz size={16} /> : <ArrowDownZa size={16} />}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentBlogs.map((blog) => (
              <motion.tr key={blog.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-100">{blog.title}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{blog.content}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Intl.DateTimeFormat("vi-VN").format(new Date(blog.createdAt))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{blog.authorName}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  <button onClick={() => handleEdit(blog)} className="text-indigo-400 hover:text-indigo-300 mr-2">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(blog)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="text-gray-400 hover:text-gray-300">
          Trước
        </button>
        <span className="text-gray-100">
          Trang {currentPage} / {totalPages}
        </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="text-gray-400 hover:text-gray-300">
          Kế tiếp
        </button>
      </div>

      {showDeletePopup && <DeleteConfirmPopup onClose={() => setShowDeletePopup(false)} onDelete={confirmDelete} />}
      {showEditPopup && <EditBlogPopup blog={selectedBlog} onClose={() => setShowEditPopup(false)} onSave={saveEdit} />}
      {showCreatePopup && <CreateBlogPopup onClose={() => setShowCreatePopup(false)} onSave={saveCreate} />}
    </motion.div>
  );
};

export default BlogsTable;