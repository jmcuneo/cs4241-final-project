import React from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import "./style.css"

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

function Results({ formData, leaderboardData, deleteRow }) {
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
          <img src={petImageUrl} alt="your pet" width="300"/>
          <p>Name: {formData.petName}</p>
          <p>Diet: {formData.dietType}</p>
          <p>Exercise level: {formData.exercise}</p>
          <p>&#127937; Race time: {formData.raceTime} seconds</p>
        </Col>

        <Col >
          <h2>Leaderboard</h2>
          <Table striped bordered hover id="leaderboard">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Pet Name</th>
                <th>Diet</th>
                <th>Exercise Level</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.petName}</td>
                  <td>{item.dietType}</td>
                  <td>{item.exercise}</td>
                  <td>{item.raceTime}</td>
                  <td>
                    <Button onClick={() => deleteRow(item._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
    );
}

export default Results;
