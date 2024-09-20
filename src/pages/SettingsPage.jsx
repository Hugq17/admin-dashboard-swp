import React from "react";
import Profile from "../components/common/settings/Profile";
import Header from "../components/common/Header";

const SettingsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Settings" />
      <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        <Profile />
      </main>
      <footer className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        <button>Sign out</button>
      </footer>
    </div>
  );
};

export default SettingsPage;
