import React, { useState } from 'react';
import Results from './Results';
import { Button, Form } from 'react-bootstrap';

function PetForm() {
  const [petName, setPetName] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [dietType, setDietType] = useState('');
  const [exerciseLevel, setExerciseLevel] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);

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
  }

  if (submitted) {
    return <Results formData={formData} />;
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
    <h2>Create your Pet to Race!</h2>
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="petName">
        <Form.Label>Pet Name:</Form.Label>
        <Form.Control
          type="text"
          name="petName"
          value={petName}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="animalType">
        <Form.Label>Animal Type:</Form.Label>
        <Form.Control
          as="select"
          name="animalType"
          value={animalType}
          onChange={handleInputChange}
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
        <Form.Label>Diet Type:</Form.Label>
        <Form.Control
          as="select"
          name="dietType"
          value={dietType}
          onChange={handleInputChange}
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
        <Form.Label>Exercise Level:</Form.Label>
        <Form.Control
          type="range"
          name="exercise"
          min="0"
          max="100"
          value={exerciseLevel}
          step="1"
          onChange={handleInputChange}
        />
        <span id="exercise-value">{exerciseLevel}</span>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  </div>
  );
}

export default PetForm;
