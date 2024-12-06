import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Tìm kiếm theo tiêu đề hoặc tác giả"
          className="w-full px-4 py-2 pr-12 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 text-black"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 rounded-full p-2 hover:bg-blue-600 focus:outline-none transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 18l6-6-6-6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
