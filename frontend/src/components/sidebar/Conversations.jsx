import Conversation from './Conversation'
import useGetConversations  from '../../hooks/useGetConversations'

const Conversations = () => {
  const {loading, conversations}= useGetConversations();
  return (

    <div className=' flex flex-col overflow-y-auto overflow-x-hidden '>

{conversations.filteredUsers && conversations.filteredUsers.map((conversation, idx) => (
        <Conversation 
          key={conversation._id} 
          conversation={conversation} 
          lastIdx={idx === conversations.filteredUsers.length - 1}
        />
      ))}
      {loading ? <span className="loading loading-spinner mx-auto"></span> : null}

     
   
      

    
      
    </div>



  )
}

export default Conversations