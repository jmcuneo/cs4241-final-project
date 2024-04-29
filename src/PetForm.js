import React, { useState, useEffect } from 'react';
import Results from './Results';
import { Button, Form,Container,Row,Col } from 'react-bootstrap';
import "./style.css"

function PetForm() {
  const [petName, setPetName] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [dietType, setDietType] = useState('');
  const [exerciseLevel, setExerciseLevel] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case 'petName':
        setPetName(value);
        break;
      case 'animalType':
        setAnimalType(value);
        break;
      case 'dietType':
        setDietType(value);
        break;
      case 'exercise':
        setExerciseLevel(value);
        break;
      default:
        break;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const raceTime = calculateRaceTime(animalType, dietType, exerciseLevel);

    const json = {
      petName: petName,
      animalType: animalType,
      dietType: dietType,
      exercise: exerciseLevel,
      raceTime: raceTime
    };

    const response = await fetch("http://localhost:3001/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });

    if (response.ok) {
      setSubmitted(true);
      setFormData(json);
      setPetName('');
      setAnimalType('dog');
      setDietType('steak');
      setExerciseLevel(50);
    }

    getLeaderboard();
  }

  useEffect(() => {
    getLeaderboard();
  }, []);

  async function getLeaderboard() {
    const response = await fetch("http://localhost:3001/get");
    const data = await response.json();

    data.sort((a, b) => a.raceTime - b.raceTime);
    setLeaderboardData(data);
  }

  /*
  async function getLeaderboard() {
    const response = await fetch("http://localhost:3001/get");
    const data = await response.json();

    data.sort((a, b) => a.raceTime - b.raceTime);
  
    const tableBody = document.querySelector("#leaderboard tbody");
    tableBody.innerHTML = ""; 
  
    data.forEach((item, index) => {
      let row = document.createElement("tr");
      let counter = index + 1;
      row.innerHTML = `
        <td>${counter}</td>
        <td>${item.petName}</td>
        <td>${item.raceTime}</td>
        <td>
          <button class="button" onclick="deleteRow('${item._id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  */

  async function deleteRow(itemID) {
    console.log(itemID)
    const json = { _id: itemID },
      body = JSON.stringify(json);
    await fetch("http://localhost:3001/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    getLeaderboard();
  }

  if (submitted) {
    return <Results formData={formData} leaderboardData={leaderboardData} deleteRow={deleteRow} />;
  }

  function calculateRaceTime(animalType, dietType, exerciseLevel) {

    // base race times for each animal type (in seconds)
    const baseRaceTimes = {
        dog: 10,
        cat: 12,
        bunny: 15,
        turtle: 20
    };

    // define energy boost multiplier based on diet
    const dietMultiplier = {
        steak: { dog: 0.9, cat: 0.85, bunny: 0.8, turtle: 0.75 },
        tuna: { dog: 0.85, cat: 0.9, bunny: 0.85, turtle: 0.8 },
        carrots: { dog: 0.8, cat: 0.85, bunny: 0.9, turtle: 0.85 },
        lettuce: { dog: 0.75, cat: 0.8, bunny: 0.85, turtle: 0.9 }
    };

    // calculate the modified race time based on diet and animal type
    let modifiedRaceTime = baseRaceTimes[animalType] * dietMultiplier[dietType][animalType];

    // adjust modified race time based on exercise level
    let adjustedRaceTime = modifiedRaceTime * (1 - (exerciseLevel / 200));

    // round off to the nearest hundredth
    adjustedRaceTime = Math.round(adjustedRaceTime * 100) / 100;

    return adjustedRaceTime;
  }

  return (
    <div>
      <h1 className='center'>Race-a-Pet</h1>
      <Container>
        <Row>
        <Col><h2 className='center'>Create your Pet to Race!</h2></Col>
       <Col><h2 className='center'>Instructions</h2></Col>
        </Row>
    
    <Row>
      <Col><p className='center'>Here, you will create your pet. Be Creative!</p></Col>
    <Col><ol>
      <li>Give your pet a name.</li>
      <li>Pick what pet you wan.</li>
      <li>Give it a Diet.</li>
      <li>Deside how much it exercises.</li>
    </ol></Col>
    </Row>
    </Container>
    <h2 className='center'>Enter Here!</h2>
    <Form  className="center" onSubmit={handleSubmit}>
      <Form.Group controlId="petName">
        <Form.Label className='formLabel'>Pet Name:</Form.Label>
        <Form.Control
          type="text"
          name="petName"
          value={petName}
          onChange={handleInputChange}
          className='formControl'
          required
        />
      </Form.Group>

      <Form.Group controlId="animalType">
        <Form.Label className='formLabel'>Animal Type:</Form.Label>
        <Form.Control
          as="select"
          name="animalType"
          value={animalType}
          onChange={handleInputChange}
          className='ormControl'
          required
        >
          <option value="" disabled>Select</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="turtle">Turtle</option>
          <option value="bunny">Bunny</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="dietType">
        <Form.Label className='formLabel'>Diet Type:</Form.Label>
        <Form.Control
          as="select"
          name="dietType"
          value={dietType}
          onChange={handleInputChange}
          className='formControl'
          required
        >
          <option value="" disabled>Select</option>
          <option value="steak">Steak</option>
          <option value="tuna">Tuna</option>
          <option value="lettuce">Lettuce</option>
          <option value="carrot">Carrot</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="exercise">
        <Form.Label className='formLabel'>Exercise Level:</Form.Label>
        <Form.Control
          type="range"
          name="exercise"
          min="0"
          max="100"
          value={exerciseLevel}
          step="1"
          onChange={handleInputChange}
          className='formControl'
        />
        <span id="exercise-value">{exerciseLevel}</span>
      </Form.Group>

      <button className='button'variant="primary" type="submit">
        Submit
      </button>
    </Form>
  </div>
  );
}

export default PetForm;
