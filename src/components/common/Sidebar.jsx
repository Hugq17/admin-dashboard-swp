import {
  Menu,
  Users,
  House,
  Newspaper,
  UserCog,
  Ticket,
  MessageSquareHeart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Trang chủ",
    icon: House,
    color: "#F59E0B",
    href: "/trangchu",
  },
  { name: "Bài viết", icon: Newspaper, color: "#34D399", href: "/baiviet" },
  { name: "Người dùng", icon: Users, color: "#3B82F6", href: "/nguoidung" },
  { name: "Workshop", icon: Ticket, color: "#F472B6", href: "/workshop" },
  {
    name: "Chủ đề sở thích",
    icon: MessageSquareHeart,
    color: "#F97316",
    href: "/sothich",
  },
  { name: "Admin", icon: UserCog, color: "#10B981", href: "/admin" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Để điều hướng người dùng

  // Kiểm tra token khi trang tải lại
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Hoặc sessionStorage nếu bạn lưu ở đó
    if (!token) {
      navigate("/login"); // Điều hướng về trang đăng nhập nếu không có token
    }
  }, [navigate]);

  const handleLogout = () => {
    // Xóa accessToken khỏi localStorage hoặc sessionStorage
    localStorage.removeItem("accessToken"); // Hoặc dùng sessionStorage.removeItem nếu bạn lưu ở đó
    navigate("/login"); // Điều hướng về trang login hoặc trang khác theo nhu cầu
    window.location.reload();
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}

          {/* Nút Logout */}
          <button
            onClick={handleLogout}
            className="mt-4 p-4 w-full text-left text-sm font-medium text-red-500 hover:bg-gray-700 transition-colors rounded-lg"
          >
            Logout
          </button>
        </nav>
      </div>
    </motion.div>
  );
};
export default Sidebar;
