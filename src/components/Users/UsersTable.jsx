import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import StatCard from "../../components/common/StatCard";
import { BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todayUsersCount, setTodayUsersCount] = useState(0);

  const totalUsersCount = users.length;

  const accessToken = localStorage.getItem("accessToken");

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
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://sharingcafe-be.onrender.com/api/admin/users",
          {
            headers: {
              Authorization: `${accessToken}`,
            },
          }
        );
        setUsers(response.data);
        setFilteredUsers(response.data);

        const todayDate = getTodayDate();
        const todayUsers = response.data.filter(
          (user) => new Date(user.registration) >= new Date(todayDate)
        );
        setTodayUsersCount(todayUsers.length);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    };

    fetchUsers();
  }, [accessToken]);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container mx-auto p-6">
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <StatCard
          name="Tổng số người dùng"
          icon={Users}
          value={totalUsersCount}
          color="#6366F1"
        />
        <StatCard
          name="Người dùng mới hôm nay"
          icon={BookOpen}
          value={todayUsersCount}
          color="#10B981"
        />
      </motion.div>

      <div className="flex justify-between items-center mb-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="table-fixed w-full h-[600px]">
          <thead className="bg-gray-100 text-gray-600">
            <tr className="border-b">
              <th className="px-6 py-4 text-center">Avatar</th>
              <th className="px-6 py-4 text-left">Tên</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-center">Giới tính</th>
              <th className="px-6 py-4 text-left">Sở thích</th>
              <th className="px-6 py-4 text-left">Vị trí</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentUsers.map((user) => (
              <tr key={user.user_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">
                  <img
                    src={user.profile_avatar}
                    alt={user.user_name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4">{user.user_name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 text-center">{user.gender}</td>
                <td className="px-6 py-4">
                  {user.interest_list.map((interest) => (
                    <span
                      key={interest.interest_id}
                      className="bg-blue-100 text-blue-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                    >
                      {interest.interest_name}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4">{`${user.district}, ${user.province}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredUsers.length}
        itemsPerPage={usersPerPage}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default UsersTable;
