import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';


/**
 * @author Jack Weinstein
 */

function LoginPage({onLogin}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Logging in...');
  
    try {
      const response = await fetch('//localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameRef.current.value,
          password: passwordRef.current.value
        })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Handle 401 Unauthorized error
          const errorMessage = await response.text(); // Read response as text
          setMessage(errorMessage); // Display the specific error message
          throw new Error(errorMessage); // Throw custom error with message
        } else {
          // Handle other errors (e.g., 500 Internal Server Error)
          const data = await response.json();
          setMessage(data.message); // Display the error message
          throw new Error(data.message); // Throw custom error with message
        }
      } 

      const data = await response.json();
      setMessage("Logging In..."); 
      onLogin(data.token);
      navigate("/main");

    } catch (error) {
      console.error('Login error:', error.message);
      setMessage('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    navigate("/register");
  };

  return (
    <motion.div 
    className="center-page-container"
    initial={{ scale: 0, x: '-50%', y: '-50%'}}
    animate={{ scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
    }}
    > 
      <h1 style={{ marginLeft: '30px' }}>Event List Sign-In</h1> 
      <form className="col s12" id="loginForm" onSubmit={handleSubmit}>
        <div className="col"> 
        <div className="input-field col s6">
            <div><label style={{ fontSize: '20px', color: 'white' }} htmlFor="username">Username</label></div>
            <input className="validate" type="text" id="username" name="username" data-length="10" required ref={usernameRef}/>
          </div>
          <div className="input-field col s6">
            <div><label style={{ fontSize: '20px', color: 'white' }} htmlFor="password">Password</label></div>
            <input className="validate" type="password" id="password" name="password" required ref={passwordRef}/>
          </div>
          <button style={{marginTop: '10px', backgroundColor: 'rgb(3, 252, 98)', color: 'black', fontWeight: 'bold' }} className="btn waves-effect waves-light"type="submit" id="loginButton">Login</button>
          <button style={{ marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold' }} className="btn waves-effect waves-light" type="button" id="registerButton" onClick={handleRegister}>Register</button>
        </div>
      </form>
      <div style={{ fontSize: '20px', marginLeft: '30px', marginTop: '10px' }}>{message}</div> 
    </motion.div>
  );
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default LoginPage;
