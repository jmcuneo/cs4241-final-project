import React from 'react';

const Home = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="bg-[#414141] h-[94%] w-[26%] min-w-[26%] p-r-1 flex flex-col">
        <div className="bg-dark w-[99.5] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center justify-center">Logged in user</div>

        <div className="bg-dark w-[99.5] h-[6.81%] mb-0.5 mr-0.5 ml-0 flex items-center justify-center">
          <label className="input flex h-[63%] w-[95%] bg-[#404040] items-center gap-2">
            <input type="text" className="grow text-[#A1A4A6] placeholder-[#A1A4A6]" placeholder="Search..." />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#A1A4A6" className="w-4 h-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
        </div>

    {/* dynamically placed rectangles with user info need to be placed here, two hardcoded ones below */}
    <div className='overflow-y-auto overflow-x-hidden h-[700px]'>
        <div className="bg-dark w-[99.5] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center justify-center">user start</div>
        <div className="bg-dark w-[99.5] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center justify-center">user</div>
        <div className="bg-dark w-[99.5] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center justify-center">user</div>
        
        <div className="bg-dark w-[99.5] h-[72px] mb-0.5 mr-0.5 ml-0 flex items-center justify-center">user</div>
        <div className="bg-dark w-[99.5] h-[72px]  mr-0.5 ml-0 flex items-center justify-center">user end</div>

        </div>
       
        
        

        
        {/*full-width rectangle that fills the remaining space*/}
        <div className="bg-dark w-[99.5] flex-1 mr-0.5 ml-0"></div>
      </div>
      

      {/* Main content */}
      <div className="flex-1 bg-[#262626] h-[94%]">
        <div>Home Content</div>
      </div>


    </div>
  );
};

export default Home;
