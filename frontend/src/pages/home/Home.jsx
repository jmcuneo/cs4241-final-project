import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import ChatContainer from '../../components/Chat/ChatContainer';

const Home = () => {
  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar />


      {/* Main content */}
      <div className="flex-1 bg-primary dark:bg-lightprimary h-[100%]">
        <ChatContainer/>

      </div>


    </div>
  );
};

export default Home;
