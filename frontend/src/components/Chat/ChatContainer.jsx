import React from 'react';
import { useEffect } from "react";
import OtherUserCard from './OtherUserCard';
import MessageInputBox from './MessageInputBox';
import Messages from './Messages';
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from '../../context/AuthContext'; 


const ChatContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

  return (

    
      
    <div className="flex flex-col h-screen">
      {!selectedConversation ? (
      <NoChatSelected />
    ) : (
      <>
      <OtherUserCard />
      <div className="flex-grow overflow-auto pt-4 pb-4">

       
         
      
          <Messages/>


      </div>
      <MessageInputBox />
      </>
			)}
    </div>
  );
}

export default ChatContainer;


const NoChatSelected = () => {

  const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.fullName}</p>
				<p>Select a chat to start messaging</p>
			</div>
		</div>
	);
};
