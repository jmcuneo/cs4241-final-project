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
    //captialize the diet string, it was bothering me 
    let temp = formData.dietType
    let Diet = temp.charAt(0).toUpperCase() + temp.slice(1);

    // Get the image URL based on animal type
    const petImageUrl = getImageUrl(formData.animalType);
    

    return (
        <Container id="results">
      <h1 class ="center">Race-a-Pet</h1>
      <h2 class="center">Race Results </h2>
      <p class="center">Here are your race results with the rest of your pets!</p>
      <Row>
        <Col><h2 class ="center">Your Pet!</h2></Col>
        <Col><h2 class ="center">Leaderboard</h2></Col>
      </Row>

      <Row>
        <Col id="your-pet">
          <img class="center" src={petImageUrl} alt="your pet" width="300"/>
          <p class="center">Name: {formData.petName}</p>
          <p class="center">Diet: {Diet}</p>
          <p class="center">Exercise level: {formData.exercise}</p>
          <p class="center">&#127937; Race time: {formData.raceTime} seconds</p>
        </Col>
        <Col >
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
                  <td>{item.dietType.charAt(0).toUpperCase() + item.dietType.slice(1)}</td>
                  <td>{item.exercise}</td>
                  <td>{item.raceTime}</td>
                  <td>
                    <button className='buttonSmall' onClick={() => deleteRow(item._id)}>Delete</button>
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
