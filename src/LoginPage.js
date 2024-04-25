import React, { useState } from 'react';
import PetForm from './PetForm';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username === 'user' && password === 'pass') {
      setLoggedIn(true);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleRegistration = () => {
    alert(`User ${newUsername} registered with password: ${newPassword}`);
    setNewUsername('');
    setNewPassword('');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      {loggedIn ? (
        <PetForm />
      ) : (
        <div>
          <h1>Race-a-Pet</h1>
          <p>Welcome to Race-a-Pet! Where you create a pet and see how far it can run!</p>
          <h2>Instructions</h2>
          <ol>
            <li>Log In with your Race-a-Pet account</li>
            <li>Create your Pet</li>
            <ol>
                <li>Give your pet a name.</li>
                <li>Pick what pet you want.</li>
                <li>Give it a diet.</li>
                <li>Deside how much it exercises.</li>
            </ol>
            <li>Race your Pet!</li>
          </ol>
        
          <h2>Login</h2>
          <Form class= 'p-1 bg-dark'>
            <Form.Group controlId="formBasicUsername">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                //class = "bg-dark"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                //class = "bg-dark"
              />
            </Form.Group>
            

            <Button variant="primary" onClick={handleLogin}>
              Login
            </Button>
          </Form>
      
        </div>
        
      )}
    </div>
  );
}

export default LoginPage;

