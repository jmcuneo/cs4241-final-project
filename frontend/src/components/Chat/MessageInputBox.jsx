import {useState} from 'react';
import SendImage from '../assets/send.svg';
import useSendMessage from '../../hooks/useSendMessage';

const MessageInputBox = () => {
    const [message, setMessage] = useState("");
    const { loading, sendMessage } = useSendMessage();  // Object destructuring

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        await sendMessage(message);
        setMessage("");
    };



    return (
        <div className="bg-other dark:bg-lightother w-full h-[58px]">
            <form onSubmit={handleSubmit} className="bg-dark dark:bg-lightdark w-full h-[56px] mb-0 mt-[2px] mr-0 ml-0 flex items-center justify-start">
                <div className="ml-3 flex items-center w-full">
                    <input
                        type="text"
                        value={message}
                        className="flex-grow mr-2 bg-primary dark:bg-lightprimary text-white dark:text-lightlight p-2 rounded-lg"
                        style={{ maxWidth: '95%' }}
                        placeholder=" Type a message..."
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type='submit'  tabIndex="0" className="flex items-center justify-center p-1 rounded hover:bg-cyan-700 focus:outline-none">
                        {loading ? <div className='loading loading-spinner'></div> : <img src={SendImage} alt="Send" className="w-8 h-8" draggable="false" />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageInputBox;
