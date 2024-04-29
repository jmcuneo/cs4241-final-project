import { useState } from 'react'
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';
import { socket } from "../socket-client.js";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
      setLoading(true);
			let messageJson = { msg: message, to: selectedConversation._id };
			socket.emit("sendMessage", messageJson);
			setLoading(false);
  }
  return {sendMessage, loading}
}

export default useSendMessage
