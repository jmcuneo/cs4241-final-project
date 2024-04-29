import React from 'react';
import kebabMenu from '../assets/kebabMenu.svg';  // Ensure the path is correct
import { useState } from 'react';
import useConversation from '../../zustand/useConversation';
import useGetConversations from '../../hooks/useGetConversations';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../../utils/ThemeToggle';

const SearchInput = () => {
    const [search, setSearch] = useState("");
    const { setSelectedConversation } = useConversation();
    const { conversations } = useGetConversations();

    const handleMenu = () => {
        console.log("Menu button clicked");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!search) return;
        if (search.length < 3) {
            return toast.error("Search term must be at least 3 characters long");
        }

        // Ensure conversations is an array before attempting to find
        if (!Array.isArray(conversations.filteredUsers)) {
            console.error("Conversations is not an array:", conversations.filteredUsers);
            return toast.error("Error fetching conversations");
        }

        const conversation = conversations.filteredUsers.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

        if (conversation) {
            setSelectedConversation(conversation);
            setSearch("");
        } else {
            toast.error(`No conversation found with the name ${search}`);
        }
    };

    return (
        <div className="flex justify-between items-center w-full bg-dark dark:bg-lightdark p-3">
            <form onSubmit={handleSubmit} className="flex-grow">
                <label className="input flex h-[63%] w-full bg-primary dark:bg-lightprimary items-center gap-2 justify-center">
                    <input
                        type="text"
                        className=" text-[13px] text-[#A1A4A6] grow placeholder-[#A1A4A6]"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={handleSubmit} tabindex="0" >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#A1A4A6" className="w-6 h-6 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7 a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </label>
            </form>
            <ThemeToggle/>
        </div>
    );
}
export default SearchInput;
