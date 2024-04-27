import React from 'react';
import LogoutButton from './LogoutButton';


const CurrentUserCard = () => {

    // Function to handle logout action
    

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
                    <LogoutButton />
                </div>
            </div>
        </>
    );
}

export default CurrentUserCard;
