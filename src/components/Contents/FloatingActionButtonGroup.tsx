import React, { useState } from 'react';
import { FaList, FaFolder, FaMusic, FaImage, FaCode, FaLink, FaVideo } from 'react-icons/fa';

const FloatingActionButtonGroup = ({
  text,
  icon,
  setSelectedItem
}: {
  text?: string;
  icon?: React.ReactNode;
  setSelectedItem: (item: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <div className="h-full relative">
      <div className="flex flex-col justify-center items-center">
        {isOpen && (
          <div className=" flex-col items-center space-y-4 absolute bottom-full left-0 mb-2">
            <div
              onClick={() => setSelectedItem('Music')}
              className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-10 h-10 rounded-full shadow-lg cursor-pointer transition-al"
            >
              <FaMusic />
            </div>
            <div
              onClick={() => setSelectedItem('File')}
              className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-10 h-10 rounded-full shadow-lg cursor-pointer transition-al"
            >
              <FaFolder />
            </div>
            <div
              onClick={() => setSelectedItem('Todo')}
              className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-10 h-10 rounded-full shadow-lg cursor-pointer transition-al"
            >
              <FaList />
            </div>
            <div
              onClick={() => setSelectedItem('Tags')}
              className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-10 h-10 rounded-full shadow-lg cursor-pointer transition-al"
            >
              <i className="">#</i>
            </div>
            <div
              onClick={() => setSelectedItem('Image')}
              className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-10 h-10 rounded-full shadow-lg cursor-pointer transition-al"
            >
              <FaImage />
            </div>
            <div
              onClick={() => setSelectedItem('Video')}
              className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-10 h-10 rounded-full shadow-lg cursor-pointer transition-al"
            >
              <FaVideo />
            </div>
            <div
              data-tooltip-content="Tooltip içerik buraya!"
              onClick={() => setSelectedItem('Code')}
              className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-10 h-10 rounded-full shadow-lg cursor-pointer transition-al"
            >
              <FaCode />
            </div>
            <div
              onClick={() => setSelectedItem('Link')}
              className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-10 h-10 rounded-full shadow-lg cursor-pointer transition-al"
            >
              <FaLink />
            </div>
          </div>
        )}
        <div
          onClick={toggleMenu}
          className="flex items-center justify-center w-10 h-10 cursor-pointer rounded-full bg-gray-100 hover:bg-gray-300"
        >
          {icon && icon}
          {text && <p className="text-sm text-gray-700">{text}</p>}
        </div>
      </div>
    </div>
  );
};

export default FloatingActionButtonGroup;
