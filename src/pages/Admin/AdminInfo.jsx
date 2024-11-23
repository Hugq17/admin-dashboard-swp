import React, { useState, useEffect } from "react";
import { FaEdit, FaUserCircle } from "react-icons/fa"; // Icon cho profile admin
import Header from "../../components/common/Header";

const AdminInfo = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy user_id từ localStorage
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      const fetchAdminData = async () => {
        try {
          const response = await fetch(
            `https://sharingcafe-be.onrender.com/api/admin/user/${userId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch admin data");
          }

          const data = await response.json();
          setAdminData(data); // Cập nhật dữ liệu vào state
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

      fetchAdminData();
    } else {
      setError("User ID not found in localStorage");
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <Header title="Trang cá nhân" />
      <div className="w-full flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={adminData.profile_avatar || FaUserCircle} // Hiển thị avatar nếu có, nếu không thì icon mặc định
                alt="Admin Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <h1 className="text-3xl font-semibold text-gray-800">
                {adminData.user_name}
              </h1>
            </div>
            <button
              onClick={() => alert("Edit functionality coming soon!")}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEdit size={20} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Email:</h2>
              <p className="text-gray-600">{adminData.email}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Phone:</h2>
              <p className="text-gray-600">{adminData.phone}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Story:</h2>
              <p className="text-gray-600">{adminData.story}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Favorite Location:
              </h2>
              <p className="text-gray-600">{adminData.favorite_location}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Address:</h2>
              <p className="text-gray-600">{adminData.address}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Date of Birth:
              </h2>
              <p className="text-gray-600">
                {new Date(adminData.dob).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;
