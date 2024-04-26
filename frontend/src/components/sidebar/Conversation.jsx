import React, { useState, useEffect } from 'react';

const Conversation = () => {
    // State to hold the current color in hex format
    const [avatarColor, setAvatarColor] = useState('#ffffff');

    // Function to generate a random hex color
    const getRandomHexColor = () => {
        const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16);
        return '#' + hex.padStart(6, '0');
    };

    // Effect to set a random color on component mount
    useEffect(() => {
        const randomColor = getRandomHexColor();
        setAvatarColor(randomColor); // Log the random color to verify it's generated correctly
    }, []); // Empty dependency array to ensure this runs only once on mount

    return (
        <>
            <div className="bg-dark w-[99.5%] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center  justify-between hover:bg-cyan-700">
                <div className="avatar placeholder ml-4">
                    <div style={{ backgroundColor: avatarColor }} className="rounded-full w-14 flex items-center justify-center">
                        <span className="text-xl text-black">JD</span>
                    </div>
                </div>
                <div className="ml-3 mb-3 mt-3 flex-grow ">

               

                
                    <span className="block font-bold text-white">Other User</span>
                    <span className="text-white text-sm mr-2">
                    12:20
                </span>
               
                    <span className="text-gray-600 text-sm overflow-hidden whitespace-nowrap text-overflow-ellipsis flex-grow: 0">
                        latest other user message
                    </span>
                    
                </div>
                
            </div>
        </>
    );
}

export default Conversation;
