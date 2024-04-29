import Message from './Message'
import useGetMessages from '../../hooks/useGetMessages'
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useEffect, useRef } from 'react';
import { extractTime } from '../../utils/extractTime.js';

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const lastMessageRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });}, 100)
  }, [messages])


  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    console.log("Last message:", lastMessage.message);
    console.log("Last Message Time" , extractTime(lastMessage.updatedAt));

  }
  
  return (
    <div>


      {!loading && messages.length > 0 && messages.map((message) => (
					<div key={message._id}
          ref={lastMessageRef}
          >
						<Message message={message} />
					</div>
				))}
      
      {loading && [...Array(4)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
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
