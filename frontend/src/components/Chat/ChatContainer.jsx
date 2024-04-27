import React from 'react';
import OtherUserCard from './OtherUserCard';
import MessageBox from './MessageBox';
import Message from './Message';

const ChatContainer = () => {
  return (
    <div className="flex flex-col h-screen">
      <OtherUserCard />
      <div className="flex-grow overflow-auto pt-4 pb-4">

        <div className="flex flex-col items-start gap-4">
          <div className="chat chat-start w-full">
            <Message
              text="YOU TURNED HER AGAINST ME!"
              username="Anakin"
              time="12:25"
              isStart={true}
            />
          </div>
          <div className="chat chat-end w-full">
            <Message
              text="You have done that yourself."
              username="Obi-Wan"
              time="12:35"
              isStart={false}
            />
          </div>
         
          <div className="chat chat-end w-full">
            <Message
              text="You underestimate my power!"
              username="Obi-Wan"
              time="12:35"
              isStart={false}
            />
          </div>
          <div className="chat chat-end w-full">
            <Message
              text="You underestimate my power!"
              username="Obi-Wan"
              time="12:35"
              isStart={false}
            />
          </div>
        </div>

      </div>
      <MessageBox />
    </div>
  );
}

export default ChatContainer;
