import React, { useState } from "react";

const AddInterestChild = ({ parentId, onAddSuccess }) => {
  const [childName, setChildName] = useState("");

  const handleSubmit = async (e) => {
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
            parent_interest_id: parentId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        onAddSuccess(data); // Callback để cập nhật lại giao diện
        setChildName(""); // Reset form sau khi thêm
      } else {
        alert("Đã có lỗi xảy ra khi tạo chủ đề con");
      }
    } catch (error) {
      console.error("Lỗi khi thêm Interest Child:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Thêm chủ đề con</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Nhập tên chủ đề con"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />
        <button
          type="submit"
          className="mt-3 w-full py-2 bg-blue-500 text-white rounded-md"
        >
          Thêm chủ đề con
        </button>
      </form>
    </div>
  );
};

export default AddInterestChild;
