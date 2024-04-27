import React from 'react';
import OtherUserCard from './OtherUserCard';
import MessageBox from './MessageBox';

const ChatContainer = () => {
  return (
    <div className="flex flex-col h-screen">
        <OtherUserCard />
        <div className="flex-grow">
            actual chats rendered here
        </div>
        <MessageBox />
    </div>
  );
}

export default ChatContainer;
