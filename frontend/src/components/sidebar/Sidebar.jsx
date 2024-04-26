import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations'
import CurrentUserCard from './CurrentUserCard'

const Sidebar = () => {
  return (
    <div className="bg-[#414141] h-[94%] w-[26%] min-w-[26%] p-r-1 flex flex-col">


      <div className="bg-[#414141] h-[100%] w-[100%] min-w-[26%] p-r-1 flex flex-col">
        <div className="bg-dark w-[99.5] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center justify-center">
          <CurrentUserCard/>
        </div>

        <div className="bg-dark w-[99.5] h-[7%] mb-0.5 mr-0.5 ml-0 flex items-center justify-center">
          <SearchInput />
        </div>

        {/* dynamically placed rectangles with user info*/}
       
        <Conversations />
      





        {/* full-width rectangle that fills the remaining space */}
        <div className="bg-dark w-[99.5] flex-1 mr-0.5 ml-0"></div>
      </div>




      {/* <Conversations/>
        <LogoutButton/> */}
    </div>
  )
}

export default Sidebar