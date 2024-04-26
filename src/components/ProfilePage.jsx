import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

function ProfilePage({ onLogout }) {
  const [userProfile, setUserProfile] = useState(null);
  const getProfile = async () => {
    try {
      const response = await fetch("//localhost:3000/api/getProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      });

      let profile = await response.json();
      // console.log(profile);
      return profile;
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  };

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setUserProfile(profile);
      })
      .catch((error) => {
        console.error("Error getting profile:", error);
      });
  }, []);

  return (
    <>
      <Navbar onLogout={onLogout} showBackButton={true}></Navbar>
      <div className="flex justify-between items-start w-fit">
        <motion.div
          className="center-page-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex min-h-max flex-col justify-center mx-auto items-center prose"
          initial={{ scale: 0, x: "-50%", y: "-50%", rotate: 180 }}
          animate={{ scale: 1, rotate: 360 }}
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
            <div className="text-xl ml-2.5 mt-2.5 color-white">
              Error loading profile
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

ProfilePage.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default ProfilePage;
