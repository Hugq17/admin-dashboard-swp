import React, { useState } from 'react';

const CreateBlogPopup = ({ onClose, onSave }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    authorName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newBlog);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-lg text-gray-100'>
        <h3 className='text-lg font-semibold mb-4'>Tạo bài viết mới</h3>
        <form onSubmit={handleSubmit}>
        <label className="text-gray-400">Tiêu đề</label>
          <input
            type='text'
            name='title'
            value={newBlog.title}
            onChange={handleChange}
            className='w-full mb-3 p-2 bg-gray-700 rounded'
          />
          <label className="text-gray-400">Nội dung</label>
          <textarea
            name='content'
            value={newBlog.content}
            onChange={handleChange}
            className='w-full mb-3 p-2 bg-gray-700 rounded h-48 resize-none'
          />
          <label className="text-gray-400">Tác giả</label>
          <input
            type='text'
            name='authorName'
            value={newBlog.authorName}
            onChange={handleChange}
            className='w-full mb-3 p-2 bg-gray-700 rounded'
          />
          <label className="text-gray-400">Ngày tạo</label>
          <input
            type='text'
            name='authorName'
            value={new Intl.DateTimeFormat("vi-VN").format(new Date())}
            className='w-full mb-3 p-2 bg-gray-700 rounded'
            readOnly
          />
          <div className='flex justify-end'>
            <button type='button' onClick={onClose} className='mr-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded'>Hủy</button>
            <button type='submit' className='px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded'>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPopup;