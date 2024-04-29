import Message from './Message'
import useGetMessages from '../../hooks/useGetMessages'
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useEffect, useRef } from 'react';
import { extractTime } from '../../utils/extractTime.js';
import { socket } from "../../socket-client.js";
import toast from "react-hot-toast";
import useConversation from "../../zustand/useConversation";

const Messages = () => {
  const { messagesexp, loading } = useGetMessages();
  const lastMessageRef = useRef(null);
	const { messages, setMessages, selectedConversation } = useConversation();
  useEffect(() => {
		socket.on("message", (message, displayName) => {
			if (message.senderId == selectedConversation._id || message.recieverId == selectedConversation._id) {
				setMessages([...messages, message]);
			}
			else {
				toast((t) => (
					<p>
						<b>{displayName}</b> says: {message.message}
					</p>
				));
			}
		});

    setTimeout(() => {lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });}, 100)

		return () => {
			socket.off("message")
		};

  }, [messagesexp, socket])


  if (messagesexp.length > 0) {
    const lastMessage = messagesexp[messagesexp.length - 1];
    console.log("Last message:", lastMessage.message);
    console.log("Last Message Time" , extractTime(lastMessage.updatedAt));

  }

  
  return (
    <div>


      {!loading && messagesexp.length > 0 && messagesexp.map((message) => (
					<div key={message._id}
          ref={lastMessageRef}
          >
						<Message message={message} />
					</div>
				))}
      
      {loading && [...Array(4)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && messagesexp.length === 0 && (
        <p className='text-center'>Send a message to start the conversation</p>
      )}

    </div>
  )
}

export default Messages


// <div>
//  <Message
//   text="YOU TURNED HER AGAINST ME!"
//   username="Anakin"
//   time="12:25"
//   isStart={true}
// />
// </div>

// <div className="chat chat-end w-full">
// <Message
//   text="You have done that yourself."
//   username="Obi-Wan"
//   time="12:35"
//   isStart={false}
// /> 
// </div>
