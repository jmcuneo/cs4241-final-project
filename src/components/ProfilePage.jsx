import React, { useState, useEffect, useRef } from 'react';
import TopButtons from './TopButtons';
import PropTypes from 'prop-types';

function ProfilePage({ onLogout }) {
  const [userProfile, setUserProfile] = useState(null);
  const getProfile = async () => {
    try {
      const response = await fetch('//localhost:3000/api/getProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: localStorage.getItem('token') }),
      });

      let profile = await response.json();
      console.log(profile);
      return profile;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  useEffect(() => {
    getProfile()
      .then(profile => {
        setUserProfile(profile);
      })
      .catch(error => {
        console.error('Error getting profile:', error);
      });
  }, []);

  return (
    <div className='main-page-container'>
      <div className='center-page-container'>
        {userProfile ? (
          <div>
            <h1>Profile</h1> 
            <h2>Username: {userProfile.username}</h2>
            <h2>First Name: {userProfile.firstName}</h2>
            <h2>Last Name: {userProfile.lastName}</h2>
            <h2>Account Type: {userProfile.accountType}</h2>
          </div>
        ) : (
          <div>Error loading profile</div>
        )}
      </div>
      <TopButtons onLogout={onLogout} showBackButton={true}></TopButtons>
    </div>
  );
}

ProfilePage.propTypes = {
  onLogout: PropTypes.func.isRequired
}

export default ProfilePage;
