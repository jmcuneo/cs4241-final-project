import React from 'react';
import kebabMenu from '../assets/kebabMenu.svg';  // Ensure the path is correct

const handleMenu = () => {
    console.log("Menu button clicked");
};

const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted!");
};

const SearchAndMenu = () => {
    return (
        <div className="flex justify-between items-center w-full bg-dark p-3"> {/* Adjusted for full width and padding */}
            <form onSubmit={handleSubmit} className="flex-grow">
                <label className="input flex h-[63%] w-full bg-[#404040] items-center gap-2 justify-center"> {/* Adjusted width to full */}
                    <input type="text" className=" text-[13px] text-[#A1A4A6] grow placeholder-[#A1A4A6]" placeholder="Search..." />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#A1A4A6" className="w-6 h-6 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7 a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
            </form>
            <button onClick={handleMenu} className="ml-4 rounded focus:outline-none">
                <img src={kebabMenu} alt="Menu" className="w-6 h-6" draggable="false" />
            </button>
        </div>
    );
}

export default SearchAndMenu;
