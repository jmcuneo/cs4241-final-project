import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import useConversation from '../../zustand/useConversation';

// Component for individual chat bubble

const Message = ({ text, isStart, message }) => {

    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;

    const chatClassName = fromMe ? 'chat-end' : 'chat-start';
    console.log(selectedConversation);

    // authUser.fullName
    // selectedConversation.fullName

    const bgColor = isStart ? 'bg-[#171717]' : 'bg-[#0091ae]';

    return (
        <div className={`chat ${chatClassName} w-full`}>
            <div className={`chat-bubble ${bgColor} text-white p-3 rounded-md shadow max-w-[40%] break-words text-center`}>
                <p>{text}</p>
                <div className="flex justify-end items-center w-full mt-3">
                    <span className="text-sm text-[#ABABAB]">12:20</span>
                </div>

            </div>
        </div>
    );
};

export default Message;
