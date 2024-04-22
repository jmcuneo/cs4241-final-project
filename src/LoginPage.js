import React, { useState } from 'react';
import PetForm from './PetForm';
import { Button, Form } from 'react-bootstrap';

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
          <h2>Login</h2>
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleLogin}>
              Login
            </Button>
          </Form>

          <h2>Register</h2>
          <Form>
            <Form.Group controlId="formBasicNewUsername">
              <Form.Control
                type="text"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicNewPassword">
              <Form.Control
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleRegistration}>
              Register
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

