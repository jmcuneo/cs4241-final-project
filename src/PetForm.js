import React, { useState } from 'react';
import Results from './Results';
import { Button, Form } from 'react-bootstrap';

function PetForm() {
  const [petName, setPetName] = useState('');
  const [animalType, setAnimalType] = useState('dog');
  const [dietType, setDietType] = useState('dogfood');
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
    const json = {
      petName: petName,
      animalType: animalType,
      dietType: dietType,
      exercise: exerciseLevel,
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
      setDietType('dogfood');
      setExerciseLevel(50);
    }
  }

  if (submitted) {
    return <Results formData={formData} />;
  }

  return (
    <div>
    <h2>Create your Pet to Race!</h2>
    <Form onSubmit={handleSubmit} className="p-4">
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
        >
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
        >
          <option value="dogfood">Dog Food</option>
          <option value="catfood">Cat Food</option>
          <option value="veggies">Veggies</option>
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
