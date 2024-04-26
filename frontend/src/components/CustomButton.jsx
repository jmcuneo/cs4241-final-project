import React from 'react';

const CustomButton = ({ text, onClick }) => {
  return (
    <button
      className="btn btn-wide bg-secondary text-[#ffffff] hover:bg-[#515151] border-none text-base font-inter"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CustomButton;
