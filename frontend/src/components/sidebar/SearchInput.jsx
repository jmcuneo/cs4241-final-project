import React from 'react'

const handleSubmit = (event) => {
    event.preventDefault();
    // Handle your submission logic here
    console.log("Form submitted!");
};


const SearchInput = () => {
  return (
    <form onSubmit={handleSubmit}>
            <div className="bg-dark w-[100%] h-[6.81%] mb-0.5 mr-0.5 ml-0 flex items-center justify-center">
                <label className="input flex h-[63%] w-[97%] bg-[#404040] items-center gap-2 justify-center">
                    <input type="text" className="text-[#A1A4A6] flex items-center justify-center placeholder-[#A1A4A6]" placeholder="Search..." />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#A1A4A6" className="w-6 h-6 opacity-70 flex items-center justify-center">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7 a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
            </div>
        </form>
  )
}

export default SearchInput