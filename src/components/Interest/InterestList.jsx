import React, { useState, useEffect } from "react";
import InterestItem from "./InterestItem";
import InterestPopup from "./InterestPopup";

const InterestList = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterest, setSelectedInterest] = useState(null); // Trạng thái quản lý popup

  useEffect(() => {
    fetch("https://sharingcafe-be.onrender.com/api/interest")
      .then((response) => response.json())
      .then((data) => {
        setInterests(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Nhóm các Interest theo Parent - Child
  const groupedInterests = interests.reduce((acc, interest) => {
    const { parent_interest_id } = interest;
    if (!parent_interest_id) {
      // Parent không có parent_interest_id, tạo mới một object interest
      acc[interest.interest_id] = { ...interest, children: [] };
    } else {
      // Nếu Interest có parent_interest_id, push vào children của Parent
      if (!acc[parent_interest_id]) {
        acc[parent_interest_id] = { children: [] }; // Đảm bảo key có children
      }
      acc[parent_interest_id].children.push(interest);
    }
    return acc;
  }, {});

  // Xử lý trường hợp children có thể không tồn tại
  const safeInterestChildren = (interest) => {
    return Array.isArray(interest.children) ? interest.children : [];
  };

  const handleCardClick = (interest) => {
    setSelectedInterest(interest); // Mở popup với nội dung interest
  };

  const closePopup = () => {
    setSelectedInterest(null); // Đóng popup
  };

  if (loading) {
    return <div className="text-center py-4 text-black">Loading...</div>;
  }

  return (
    <div className="w-full flex flex-wrap gap-6">
      {Object.values(groupedInterests).map((parent) => {
        const childCount = safeInterestChildren(parent).length;

        return (
          <div
            key={parent.interest_id}
            className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-lg shadow-lg overflow-hidden h-32"
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => handleCardClick(parent)}
            >
              <InterestItem interest={parent} />
              <span className="text-sm text-gray-500">
                {childCount} chủ đề con
              </span>
            </div>
          </div>
        );
      })}

      {/* Hiển thị Popup nếu có interest được chọn */}
      {selectedInterest && (
        <InterestPopup interest={selectedInterest} onClose={closePopup} />
      )}
    </div>
  );
};

export default InterestList;
