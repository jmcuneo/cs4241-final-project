import React, { useState, useRef } from 'react';
import TopButtons from './TopButtons';

function ProfilePage({ onLogout }) {

  return(
    <div className='main-page-container'>
      <div>
        <h1 className='header-section'>Profile</h1>
      </div>
      <TopButtons onLogout={onLogout} showBackButton={true}></TopButtons>
    </div>
  );
}

export default ProfilePage;
