import React from 'react';

const OtherUserCard = () => {
  return (
    <>
      <div className="bg-[#414141] w-full h-[74px]">
        <div className="bg-dark w-full h-[72px] mb-0.5 mr-0 ml-0 flex items-center justify-start">
          <div className="avatar placeholder ml-4">
            <div className="bg-green-500 rounded-full w-14 flex items-center justify-center">
              <span className="text-xl text-black">OU</span>
            </div>
          </div>
          <div className="ml-3">
            <span className="font-semibold text-white">Other User</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default OtherUserCard;
