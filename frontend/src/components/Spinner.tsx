import React from 'react';

interface SpinnerProps {
  width?: string;
  height?: string;
  open?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ width = '100%', height = '1rem', open = false }) => {
  return (
    <>
      {open && (
        <div className="flex justify-center">
          <svg className="animate-spin h-7 w-7 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"></path>
          </svg>
        </div>
      )}
    </>
  );
};

export default Spinner;
