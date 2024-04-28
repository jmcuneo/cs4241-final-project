import React from 'react';
import { getInitials } from '../../utils/utils.js';
import useConversation from '../../zustand/useConversation';  // Import the useConversation hook

const OtherUserCard = () => {
  const { selectedConversation } = useConversation();  // Use the hook to access the selected conversation

  return (
    <>
      <div className="bg-[#414141] w-full h-[74px]">
        <div className="bg-dark w-full h-[72px] mb-0.5 mr-0 ml-0 flex items-center justify-start">
          <div className="avatar placeholder ml-4">
            {/* Use data from selectedConversation to set initials and background color */}
            <div className={`rounded-full w-14 flex items-center justify-center "bg-green-500"
             
            }`
            }
            style={{ backgroundColor: selectedConversation.profilePic }}
            >
              <span className="text-xl text-black">
                {selectedConversation ? getInitials(selectedConversation.fullName) : 'OU'}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <span className="font-semibold text-white">
              {selectedConversation ? selectedConversation.fullName : 'Other User'}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default OtherUserCard;
