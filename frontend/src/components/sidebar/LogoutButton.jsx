import React from 'react';
import LogoutImage from '../assets/logout.svg';
import useLogout from '../../hooks/useLogout';

const LogoutButton = () => {
    const { loading, logout } = useLogout();

    return (
        <div>
            {!loading ? (
                <button onClick={logout} className="flex items-center justify-center p-1 rounded hover:bg-cyan-700 focus:outline-none">
                    <img src={LogoutImage} alt="Logout" className="w-4 h-4" draggable="false" />
                </button>
            ) : (
                <span className="loading loading-spinner"></span>
            )}
        </div>
    );
};

export default LogoutButton;
