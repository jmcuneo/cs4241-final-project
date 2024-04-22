import React from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';

// get image URL based on animal type
function getImageUrl(animalType) {
    switch(animalType){
        case 'dog':
            return require("../src/img/dog.jpeg");
        case 'cat':
            return require("../src/img/cat.jpeg");
        case 'turtle':
            return require("../src/img/turtle.jpeg");
        case 'bunny':
            return require("../src/img/bunny.webp");
        default:
            return ""; // empty string if animalType is undefined or null
    }
}

function Results({ formData }) {
    // Check if formData exists before accessing its properties
    if (!formData) {
        return <div>Loading...</div>;
    }

    // Get the image URL based on animal type
    const petImageUrl = getImageUrl(formData.animalType);

    return (
        <Container id="results">
      <h1>Race Results</h1>

      <Row>
        <Col id="your-pet">
          <h2>Your Pet!</h2>
          <img src={petImageUrl} alt="your pet" />
          <p>Name: {formData.petName}</p>
          <p>Diet: {formData.dietType}</p>
          <p>Exercise level: {formData.exercise}</p>
          <p>Race time: </p>
        </Col>

        <Col id="leaderboard">
          <h2>Leaderboard</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Pet Name</th>
                <th>Time</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Add leaderboard rows dynamically here */}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
    );
}

export default Results;
