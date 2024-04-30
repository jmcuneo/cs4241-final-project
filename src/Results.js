import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import "./style.css"

// get image URL based on animal type
function getImageUrl(animalType) {
    switch(animalType){
        case 'dog':
            return require("../src/img/dog.png");
        case 'cat':
            return require("../src/img/cat.png");
        case 'turtle':
            return require("../src/img/turtle.png");
        case 'bunny':
            return require("../src/img/bunny.png");
        case 'lizard':
            return require("../src/img/lizard.png");
        case 'hamster':
            return require("../src/img/hamster.png");
        default:
            return ""; // empty string if animalType is undefined or null
    }
}

function Results({ formData, leaderboardData, deleteRow }) {


    // Check if formData exists before accessing its properties
    if (!formData) {
        return <div>Loading...</div>;
    }
    
    // Capitalize the diet string
    let temp = formData.dietType
    let Diet = temp.charAt(0).toUpperCase() + temp.slice(1);

    // Get the image URL based on animal type
    const petImageUrl = getImageUrl(formData.animalType);

    return (
        <div>
             <h1 role="heading" aria-label="Name">&#127937;Race-a-Pet</h1>
        <Container id="results">
            <h2 className="center" role="heading" aria-label="Race Results">Race Results</h2>
            <p className="center" aria-label="about">Here are your race results with the rest of your pets!</p>
            <Row>
                <Col><h2 role="heading" aria-label="Your Pet" className="center">Your Pet!</h2></Col>
                <Col><h2 role ="heading" aria-label="Leaderboard" className="center">Leaderboard</h2></Col>
            </Row>

            <Row>
                <Col aria-label="Pet Info" id="your-pet">
                    <img className="center" src={petImageUrl} alt="your pet" width="300"/>
                    <p className="center">Name: {formData.petName}</p>
                    <p className="center">Diet: {Diet}</p>
                    <p className="center">Exercise level: {formData.exercise}</p>
                    <p className="center">&#127937; Race time: {formData.raceTime} seconds</p>
                    <Link to="/PetForm">
                    <button role="button" aria-label="Go to Pet Form" className='button center'>
                      Go to Pet Form
                    </button>
                  </Link>

                </Col>
                <Col>
                    <Table striped bordered hover id="leaderboard">
                        <thead>
                            <tr>
                                <th aria-label="Rank">Rank</th>
                                <th aria-label="Pet Name">Pet Name</th>
                                <th aria-label="Animal">Animal</th>
                                <th aria-label="Diet">Diet</th>
                                <th aria-label="Exercise Level">Exercise Level</th>
                                <th aria-label="Time">Time</th>
                                <th aria-label="Actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.petName}</td>
                                    <td>{item.animalType.charAt(0).toUpperCase() + item.animalType.slice(1)}</td>
                                    <td>{item.dietType.charAt(0).toUpperCase() + item.dietType.slice(1)}</td>
                                    <td>{item.exercise}</td>
                                    <td>{item.raceTime}</td>
                                    <td>
                                        <button role="button" aria-label="Delete" className='buttonSmall' onClick={() => deleteRow(item._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
        </div>
    );
}

export default Results;
