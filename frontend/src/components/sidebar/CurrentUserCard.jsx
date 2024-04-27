import React from 'react'
import LogoutImage from '../assets/logout.svg'

const CurrentUserCard = () => {
    // Function to handle logout action
    const handleLogout = () => {
        console.log("Logout clicked!");
        // Add your logout logic here
    };

    return (
        <>
            <div className="bg-dark w-[99.5%] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center justify-between">
                <div className="avatar placeholder ml-4">
                    <div className="bg-gray-500 rounded-full w-14 flex items-center justify-center">
                        <span className="text-xl text-black">CU</span>
                    </div>
                </div>
                <div className="ml-3">
                    <span className="block font-semibold text-white mr-4">Current User</span>
                </div>
                <div className="text-white text-sm mr-4 flex items-center justify-center">
                    <button onClick={handleLogout} className="flex items-center justify-center p-1 rounded hover:bg-cyan-700 focus:outline-none">
                        <img src={LogoutImage} alt="Logout" className="w-4 h-4" draggable="false" />
                    </button>
                </div>
            </div>
        </>
    );
}

export default CurrentUserCard;
