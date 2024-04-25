import React, { useState, useEffect, useRef } from 'react';
import TopButtons from './TopButtons';
import PropTypes from 'prop-types';

function ProfilePage({ onLogout }) {

  const getProfile = async () => {
    try {
      const response = await fetch('//localhost:3000/api/getProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: localStorage.getItem('token') }),
      });

      const profile = await response.json();
      console.log(profile);
    } catch (error) {
      console.error('Error getting profile:', error);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className='main-page-container'>
      <div>
        <h1 className='header-section'>Profile</h1>
      </div>
      <TopButtons onLogout={onLogout} showBackButton={true}></TopButtons>
    </div>
  );
}

ProfilePage.propTypes = {
  onLogout: PropTypes.func.isRequired
}

export default ProfilePage;