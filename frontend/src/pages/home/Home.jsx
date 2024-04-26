import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';

const Home = () => {
  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar />

      {/* Main content */}
      <div className="flex-1 bg-[#262626] h-[100%]">
        <div>Home Content</div>
      </div>


    </div>
  );
};

export default Home;
