import { React, useEffect } from 'react';
import useConversation from '../../zustand/useConversation';
import { extractTimeSimple } from '../../utils/extractTimeSimple.js';
import { getInitials } from '../../utils/utils.js'

const Conversation = ({ conversation, lastIdx }) => {

    const { selectedConversation, setSelectedConversation } = useConversation();
    const isSelected = selectedConversation?._id === conversation._id;

    // Assuming you have the last message data here, you might need to fetch it differently
    const lastMessageTime = extractTimeSimple(conversation.updatedAt);  // using updatedAt for simplicity

    return (

        <div className={`bg-dark dark:bg-lightdark w-[99.5%] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center justify-between  dark:hover:bg-purp hover:bg-purp cursor-pointer ${isSelected ? "bg-purp dark:bg-purp" : ""}`}
            onClick={() => setSelectedConversation(conversation)}>
            <div className="avatar placeholder ml-4">
            
                <div style={{ backgroundColor: conversation.profilePic }} className={`rounded-full ${isSelected ? "ring ring-[#000000]":  ""} w-14 flex items-center justify-center`}>
                    <span className="text-xl select-none text-black">{getInitials(conversation.fullName)}</span>
                </div>
            </div>
            <div className="ml-3 mb-3 mt-3 flex-grow">
                <span className="block font-bold text-white flex-grow: 0">{conversation.fullName}</span>
                <span className="text-white text-sm mr-2">{/*10:10*/}</span>
                <span className="text-gray-600 text-sm overflow-hidden whitespace-nowrap text-overflow-ellipsis flex-grow: 0"></span>
            </div>
        </div>
    );
};

export default Conversation;
