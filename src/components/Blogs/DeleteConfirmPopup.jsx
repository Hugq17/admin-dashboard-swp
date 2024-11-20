import React from 'react';

const DeleteConfirmPopup = ({ onClose, onDelete }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-lg text-gray-100'>
        <h3 className='text-lg font-semibold'>Xác nhận xóa</h3>
        <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
        <div className='flex justify-end mt-4'>
          <button onClick={onClose} className='mr-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded'>Hủy</button>
          <button onClick={onDelete} className='px-4 py-2 bg-red-600 hover:bg-red-700 rounded'>Xóa</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmPopup;