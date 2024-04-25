import React, { useState, useEffect, useRef } from 'react';
import TopButtons from './TopButtons';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

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
      <motion.div 
      className='center-page-container'
      initial={{ scale: 0, x: '-50%', y: '-50%', rotate: 180 }}
      animate={{ scale: 1, rotate: 360}}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      >
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
      </motion.div>
      <TopButtons onLogout={onLogout} showBackButton={true}></TopButtons>
    </div>
  );
}

ProfilePage.propTypes = {
  onLogout: PropTypes.func.isRequired
}

export default ProfilePage;
