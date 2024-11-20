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

	useEffect(() => {
		const fetchBlogStats = async () => {
			try {
				const response = await axios.get('https://sharingcafe-be.onrender.com/api/blog');
				const blogs = response.data.blogs;

				// Tổng số bài viết
				setTotalBlogs(blogs.length);

				// Tính số bài viết mới trong tuần
				const oneWeekAgo = new Date();
				oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

				const newBlogs = blogs.filter(blog => new Date(blog.createdAt) >= oneWeekAgo);
				setNewBlogsCount(newBlogs.length);
			} catch (error) {
				console.error("Error fetching blog stats: ", error);
			}
		};

		fetchBlogStats();
	}, []);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Bài viết' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Tổng bài viết' icon={BookOpen} value={totalBlogs} color='#6366F1' />
					<StatCard name='Bài viết mới' icon={BookOpenCheck} value={newBlogsCount} color='#10B981' />
				</motion.div>

				<BlogsTable />

				{/* CHARTS */}
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
					{/* Có thể thêm biểu đồ tại đây */}
				</div>
			</main>
		</div>
	);
};

export default BlogsPage;