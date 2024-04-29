import  { useState, useEffect } from 'react'
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';
import { socket } from "../socket-client.js"

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const {messages, setMessages, selectedConversation} = useConversation();


    useEffect(() => {

        const getMessages = async () =>{
            setLoading(true);
						let startId = 0; // temporary var will be passsed as arg once this is all working
						let requestJson = { index: startId, to: selectedConversation._id };
						socket.emit("getMessages", requestJson);
						
            try {
							socket.on("conversation", (convo) => {
                const data = convo;

                if(data.error) throw new Error(data.error);
                setMessages(convo);
							});
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false);
            }
            
        }

        if(selectedConversation?._id)  getMessages();
           
      
        
    }, [selectedConversation?._id, setMessages])
    return {loading, messages}

    
}

export default useGetMessages 

