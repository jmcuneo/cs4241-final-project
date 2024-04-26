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
        setAvatarColor(randomColor);
        console.log(randomColor); // Log the random color to verify it's generated correctly
    }, []); // Empty dependency array to ensure this runs only once on mount

    return (
        <>
            <div className="bg-dark w-[99.5%] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center justify-start hover:bg-cyan-700">
                <div className="avatar placeholder ml-4">
                    <div style={{ backgroundColor: avatarColor }} className="text-neutral-content rounded-full w-14 flex items-center justify-center">
                        <span className="text-xl text-black">JD</span>
                    </div>
                </div>
                <div className="ml-3">
                    <span className="block font-semibold">John Doe</span> {/* Use block to ensure it takes its own line */}
                    <span className="text-gray-600 text-sm">John Doe: Ok I am coming</span> {/* Slightly gray subtitle */}
                </div>
            </div>
        </>
    );
}

export default Conversation;
