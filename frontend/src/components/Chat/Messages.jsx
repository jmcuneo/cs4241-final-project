import Message from './Message'
import useGetMessages from '../../hooks/useGetMessages'
import MessageSkeleton from "../skeletons/MessageSkeleton";

const Messages = () => {

  const { messages, loading } = useGetMessages();
  
  return (
    <div>


      {!loading && messages.length > 0 && messages.map((message) => (
					<div key={message._id}>
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