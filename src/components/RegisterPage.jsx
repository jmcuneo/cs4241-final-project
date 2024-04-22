import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom"

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);


  const navigate = useNavigate()
  const handleLogin = async (event) => {
    event.preventDefault();
    navigate("/");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Registering');

    try {
      const response = await fetch('localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameRef.current.value,
          password: passwordRef.current.value
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Registration successful! You can now log in.');
      } else {
        setMessage('Registration failed. Please try again: ' + data.message);
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
            <input className="validate" type="text" id="firstName" name="firstName" data-length="10" required ref={usernameRef}/>
          </div>
          <div className="input-field col s6">
            <div><label style={{ fontSize: '20px', color: 'white' }} htmlFor="username">Last Name</label></div>
            <input className="validate" type="text" id="lastName" name="lastName" data-length="10" required ref={usernameRef}/>
          </div>
          <div className="input-field col s6">
            <div><label style={{ fontSize: '20px', color: 'white' }} htmlFor="username">Username</label></div>
            <input className="validate" type="text" id="username" name="username" data-length="10" required ref={usernameRef}/>
          </div>
          <div className="input-field col s6">
            <div><label style={{ fontSize: '20px', color: 'white' }} htmlFor="password">Password</label></div>
            <input className="validate" type="password" id="password" name="password" required ref={passwordRef}/>
          </div>
          <div className="input-field col s6">
            <div><label style={{ fontSize: '20px', color: 'white' }}>User Type</label></div>
            <input type="search" list="userTypes" name="selectUserType" />
            <datalist id="userTypes">
              <option value="User"></option>
              <option value="Admin"></option>
            </datalist>
          </div>
          <button style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold'}} className="btn waves-effect waves-light" type="button" id="logoutButton" onClick={handleLogin}>Back</button>
          <button style={{marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold' }} className="btn waves-effect waves-light" type="button" id="registerButton" onClick={handleSubmit}>Register</button>
        </div>
      </form>
      <div style={{ fontSize: '20px', marginLeft: '30px', marginTop: '10px' }}>{message}</div> 
    </div>
  );
}

export default RegisterPage;
