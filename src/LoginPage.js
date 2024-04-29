import React, { useState } from 'react';
import PetForm from './PetForm';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';
import "./style.css"

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
          <h1 class="center">Race-a-Pet</h1>
        
          <Container>
      <Row>
        <Col><h2 class="center">About</h2></Col>
        <Col><h2 class="center">Instructions</h2></Col>
      </Row>
      <Row>
        <Col>
        <p class = "center">Welcome to Race-a-Pet! Where you create a pet and see how far it can run!</p>
        <p class = "center">Created by: Esha Bajwa, Joselin Barbosa, and Jolene Pern</p>
        </Col>
          <Col><ol>
            <li>Log In with your Race-a-Pet account</li>
            <li>Create your Pet</li>
            <ol>
              <li>Give your pet a name.</li>
              <li>Pick what pet you want.</li>
              <li>Give it a diet.</li>
              <li>Deside how much it exercises.</li>
            </ol>
            <li>Race your Pet!</li>
          </ol></Col>
        
      </Row>
    </Container>
          <h2 class = 'center'>Login</h2>
          <Form class="center">
            <Form.Group controlId="formBasicUsername">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                class = "center"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                class = "center"
              />
            </Form.Group>
          

            <button class="button center" onClick={handleLogin}>
              Login
            </button>
          </Form>
          
        </div>
        
      )}
    </div>
  );
}

export default LoginPage;

