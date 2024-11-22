import React from "react";
import InterestList from "../../components/Interest/InterestList";
import Header from "../../components/common/Header";

function Interest() {
  return (
    <div className="w-full h-screen overflow-y-auto">
      <Header title="Chủ đề sở thích" />
      <div className="bg-white rounded-lg shadow-lg mx-auto mt-6 ml-12">
        <InterestList />
      </div>
    </div>
  );
}

export default Interest;
