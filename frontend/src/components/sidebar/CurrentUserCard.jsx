import React from 'react';
import LogoutButton from './LogoutButton';
import { useAuthContext } from '../../context/AuthContext.jsx';  // Adjust the import path if necessary
import { getInitials } from '../../utils/utils.js';

const CurrentUserCard = () => {
    const { authUser } = useAuthContext();  // Use the context to get the current user

    return (
        <>
            <div className="bg-dark dark:bg-lightdark w-[99.5%] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center justify-between">
                <div className="avatar placeholder ml-4">
                    <div className="rounded-full w-14 flex items-center justify-center"
                        style={{ backgroundColor: authUser ? authUser.profilePic : '#gray' }}>
                        {/* Display initials */}
                        <span className="text-xl text-black select-none">{authUser ? getInitials(authUser.fullName) : 'CU'}</span>
                    </div>
                </div>

                <div className="ml-3">
                    {/* Dynamically display the username */}
                    <span className="block font-semibold text-white mr-4">{authUser ? authUser.fullName : 'Loading...'}</span>
                </div>
                <div className="text-white text-sm mr-4 flex items-center justify-center">
                    <LogoutButton />
                </div>
            </div>
        </>
    );
}

export default CurrentUserCard;
