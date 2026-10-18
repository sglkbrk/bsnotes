import React, { useState } from 'react';
import MotionDiv from '../Motion/MotionDiv';

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
  const list = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

  return (
    <div className="h-full relative">
      <div className="flex flex-col justify-center items-center">
        {isOpen && (
          <div className=" flex-col items-center space-y-4 absolute bottom-full left-0 mb-2">
            {list.map((item, index) => (
              <MotionDiv delayOffset={0.05 * index}>
                <div
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-10 h-10 rounded-full shadow-lg cursor-pointer transition-al"
                >
                  <i className="">{item}</i>
                </div>
              </MotionDiv>
            ))}
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

// import React, { useState } from 'react';

// const FloatingActionButtonGroup = ({ direction = 'right', position = { top: '20%', left: '50%' } }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   // Flexbox yönüne göre sınıflar
//   const buttonDirection = direction === 'right' ? 'flex-row' : 'flex-row-reverse';

//   return (
//     <div className="relative">
//       {/* Floating Action Button */}
//       {isOpen && (
//         <div
//           className={`items-center space-x-4 `}
//           style={{
//             transform: 'translateX(-50%)', // Butonları ortalamak için
//             display: 'flex'
//           }}
//         >
//           <div className="bg-green-500 text-white p-3 rounded-full shadow-lg cursor-pointer transition-all hover:bg-green-600">
//             <i className="fas fa-search"></i>
//           </div>
//           <div className="bg-yellow-500 text-white p-3 rounded-full shadow-lg cursor-pointer transition-all hover:bg-yellow-600">
//             <i className="fas fa-camera"></i>
//           </div>
//           <div className="bg-red-500 text-white p-3 rounded-full shadow-lg cursor-pointer transition-all hover:bg-red-600">
//             <i className="fas fa-trash"></i>
//           </div>
//         </div>
//       )}
//       <div
//         onClick={toggleMenu}
//         className="bg-blue-500 text-white p-4 rounded-full shadow-lg cursor-pointer transition-all hover:bg-blue-600"
//         style={{
//           position: 'absolute',
//           top: position.top,
//           left: position.left,
//           transform: 'translateX(-50%)' // Butonu ortalamak için
//         }}
//       >
//         <i className="fas fa-plus"></i>
//       </div>
//     </div>
//   );
// };

// export default FloatingActionButtonGroup;
