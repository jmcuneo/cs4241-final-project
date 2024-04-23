import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom"

/**
 * @author Jack Weinstein
 */

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  const navigate = useNavigate()
  const handleLogin = async (event) => {
    event.preventDefault();
    navigate("/");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Registering');

    try {
      const response = await fetch('//localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameRef.current.value,
          password: passwordRef.current.value,
          firstName: firstNameRef.current.value,
          lastName: lastNameRef.current.value
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Registration successful! You can now log in.');
      } else {
        setMessage('Registration failed: ' + data.message);
      }

    } catch (error) {
      console.error('Registration error:', error.message);
      setMessage('An error occurred during registration: ' + error.message);
    }
  };

  return(
    <div className="row" style={{ marginLeft: '20px' }}> 
      <h1>Register</h1> 
      <form className="col s12" id="regsiterForm" onSubmit={handleSubmit}>
        <div className="col"> 
          <div className="input-field col s6">
            <div><label style={{ fontSize: '20px', color: 'white' }} htmlFor="username">First Name</label></div>
            <input className="validate" type="text" id="firstName" name="firstName" data-length="10" required ref={firstNameRef}/>
          </div>
          <div className="input-field col s6">
            <div><label style={{ fontSize: '20px', color: 'white' }} htmlFor="username">Last Name</label></div>
            <input className="validate" type="text" id="lastName" name="lastName" data-length="10" required ref={lastNameRef}/>
          </div>
          <div className="input-field col s6">
            <div><label style={{ fontSize: '20px', color: 'white' }} htmlFor="username">Username</label></div>
            <input className="validate" type="text" id="username" name="username" data-length="10" required ref={usernameRef}/>
          </div>
          <div className="input-field col s6">
            <div><label style={{ fontSize: '20px', color: 'white' }} htmlFor="password">Password</label></div>
            <input className="validate" type="password" id="password" name="password" required ref={passwordRef}/>
          </div>
          <button style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(235, 79, 52)', color: 'black', fontWeight: 'bold'}} className="btn waves-effect waves-light" type="button" id="logoutButton" onClick={handleLogin}>Back</button>
          <button style={{marginTop: '10px', marginLeft: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold' }} className="btn waves-effect waves-light" type="submit" id="registerButton">Register</button>
        </div>
      </form>
      <div style={{ fontSize: '20px', marginLeft: '30px', marginTop: '10px' }}>{message}</div> 
    </div>
  );
}

export default RegisterPage;
