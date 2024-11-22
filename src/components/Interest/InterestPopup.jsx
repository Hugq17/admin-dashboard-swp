import React, { useState } from "react";

const InterestPopup = ({ interest, onClose }) => {
  const [isAddingChild, setIsAddingChild] = useState(false); // Trạng thái hiển thị form thêm Interest Child
  const [childName, setChildName] = useState(""); // Trạng thái tên của Interest Child

  // Gửi yêu cầu tạo Interest Child qua API
  const handleAddChild = async (e) => {
    e.preventDefault();

    if (!childName.trim()) {
      alert("Vui lòng nhập tên chủ đề con");
      return;
    }

    try {
      const response = await fetch(
        "https://sharingcafe-be.onrender.com/api/interest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: childName,
            parent_interest_id: interest.interest_id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setChildName(""); // Reset form sau khi thêm
        setIsAddingChild(false); // Đóng form sau khi thêm
      } else {
        alert("Đã có lỗi xảy ra khi tạo chủ đề con");
      }
    } catch (error) {
      console.error("Lỗi khi thêm Interest Child:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{interest.name}</h3>
          <button onClick={onClose} className="text-gray-500 text-2xl">
            &times;
          </button>
        </div>

        <p className="text-gray-700 mb-4">
          Số chủ đề con: {interest.children?.length || 0}
        </p>

        <button
          onClick={() => setIsAddingChild(true)}
          className="mb-4 text-white bg-blue-500 rounded-full p-2 hover:bg-blue-700"
        >
          <span className="text-xl">+</span> Thêm chủ đề con
        </button>

        {/* Hiển thị form để thêm Interest Child */}
        {isAddingChild && (
          <form onSubmit={handleAddChild} className="flex flex-col">
            <input
              type="text"
              placeholder="Nhập tên chủ đề con"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="p-2 mb-4 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Thêm chủ đề con
            </button>
          </form>
        )}

        {/* Hiển thị danh sách các chủ đề con */}
        {interest.children && interest.children.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Danh sách chủ đề con:</h4>
            <ul>
              {interest.children.map((child) => (
                <li key={child.interest_id} className="text-gray-700 mb-2">
                  {child.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestPopup;
