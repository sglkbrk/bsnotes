import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`bg-white rounded-xl shadow-lg p-6 max-w-md w-full transform transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Are you sure?</h2>
          <p className="text-gray-600 mt-2">{message}</p>
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={onConfirm}
            className="bg-[#FDB460] hover:bg-[#e39646] text-white px-5 py-2 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
