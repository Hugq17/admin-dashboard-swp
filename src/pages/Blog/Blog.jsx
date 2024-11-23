import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

import { BookOpen, BookOpenCheck } from "lucide-react";

import axios from "axios";
import BlogsTable from "../../components/Blogs/BlogsTable";

const BlogsPage = () => {
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [newBlogsCount, setNewBlogsCount] = useState(0);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Bài viết" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}

        <BlogsTable />

        {/* CHARTS */}
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          {/* Có thể thêm biểu đồ tại đây */}
        </div>
      </main>
    </div>
  );
};

export default BlogsPage;
