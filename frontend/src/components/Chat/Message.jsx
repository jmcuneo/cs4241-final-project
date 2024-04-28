import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { extractTime } from "../../utils/extractTime";
import useConversation from '../../zustand/useConversation';

// Component for individual chat bubble

const Message = ({ text, time, message }) => {

    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);

    const chatClassName = fromMe ? 'chat-end' : 'chat-start';


    // authUser.fullName
    // selectedConversation.fullName

    const bgColor = fromMe ? 'bg-[#0091ae]' : 'bg-[#171717]';

    return (
        <div className={`chat ${chatClassName} w-full`}>
            <div className={`chat-bubble ${bgColor} text-white p-3 rounded-md shadow max-w-[40%] break-words text-center`}>
            <p>{message.message}</p>
                <div className="flex justify-end items-center w-full mt-3">
                    <span className="text-sm text-[#ABABAB]">{formattedTime}</span>
                </div>

            </div> 
        </div>
    );
};

export default Message;
