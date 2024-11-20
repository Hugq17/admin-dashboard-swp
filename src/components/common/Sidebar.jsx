import {
  BarChart2,
  DollarSign,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  House,
  Newspaper
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Trang chủ",
    icon: House,
    color: "#DEAA79",
    href: "/trangchu",
  },
  { name: "Bài viết", icon: Newspaper, color: "#10B981", href: "/baiviet" },
  { name: "Người dùng", icon: Users, color: "#80C4E9", href: "/nguoidung" },
  { name: "Sales", icon: DollarSign, color: "#10B981", href: "/sales" },
  { name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
  { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
  { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
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
