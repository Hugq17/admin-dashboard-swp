import React from "react";

const InterestItem = ({ interest, isChild }) => {
  return (
    <div className={`flex items-center ${isChild ? "pl-4" : ""}`}>
      {!isChild && interest.image && (
        <img
          src={interest.image}
          alt={interest.name}
          className="w-12 h-12 rounded-full mr-4"
        />
      )}
      <div className="flex-1">
        <p className="font-bold text-black">{interest.name}</p>
        <p className="text-sm text-gray-600">Blogs: {interest.num_of_blog}</p>
      </div>
    </div>
  );
};

export default InterestItem;
