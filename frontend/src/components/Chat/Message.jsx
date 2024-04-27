import React from 'react';

// Component for individual chat bubble
const Message = ({ text, username, time, isStart }) => {
    const bgColor = isStart ? 'bg-[#171717]' : 'bg-[#0091ae]';

    return (
        <div className={`chat-bubble ${bgColor} text-white p-3 rounded-md shadow max-w-[40%] break-words`}>
            <p>{text}</p>
            <div className="flex justify-between items-center w-full mt-3">
                <span className="text-sm text-[#ABABAB]">{username}</span>
                <span className="text-sm text-[#ABABAB]">{time}</span>
            </div>
        </div>
    );
};

export default Message;
