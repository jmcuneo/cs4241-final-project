import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { extractTime } from "../../utils/extractTime";
import useConversation from '../../zustand/useConversation';

// Component for individual chat bubble

const Message = ({ message }) => {

    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);

    const chatClassName = fromMe ? 'chat-end' : 'chat-start';
    const chatClassName2 = fromMe ? 'r' : 'l';


    // authUser.fullName
    // selectedConversation.fullName

    const bgColor = fromMe ? 'bg-purp' : 'bg-[#171717]';

    return (
        <div>
            <div className={`chat ${chatClassName}`}>
                <div className={`chat-bubble ${bgColor}  text-white p-3 rounded-md shadow max-w-[40%] break-words text-center`}>
                    <p>{message.message}</p>
                </div>
                <div className={`chat-footer text-footer opacity-50  text-center`}>
                    {formattedTime}
                </div>
            </div>
        </div>
    );
};

export default Message;

