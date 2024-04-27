import React from 'react';
import SendImage from '../assets/send.svg';


const handleSend = () => {
    console.log("send clicked!");
    // Add your logout logic here
};

const MessageInputBox = () => {



    return (
        <div className="bg-[#414141] w-full h-[58px]">
            <div className="bg-dark w-full h-[56px] mb-0 mt-[2px] mr-0 ml-0 flex items-center justify-start">
                <div className="ml-3 flex items-center w-full"> {/* Ensure full width for parent container */}
                    <input
                        type="text"
                        className="flex-grow mr-2 bg-[#262626] text-white p-2 rounded-lg"
                        style={{ maxWidth: '95%' }}
                        placeholder=" Type a message..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                    />
                    <button onClick={handleSend} className="flex items-center justify-center p-1 rounded hover:bg-cyan-700 focus:outline-none">
                        <img src={SendImage} alt="Send" className="w-8 h-8" draggable="false" />
                    </button>
                </div>

            </div>
        </div>
    );


};

export default MessageInputBox;
