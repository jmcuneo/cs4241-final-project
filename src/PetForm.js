import React, { useState } from 'react';

function PetForm() {
  const [petName, setPetName] = useState('');
  const [animalType, setAnimalType] = useState('dog');
  const [dietType, setDietType] = useState('dogfood');
  const [exerciseLevel, setExerciseLevel] = useState(50);

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

  function handleSubmit(event) {
    event.preventDefault();
    // Do something with the form data, like submit to a backend API
    console.log('Form submitted:', { petName, animalType, dietType, exerciseLevel });
  }

  return (
    <div>
      <h2>Create your Pet to Race!</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="petName">Pet Name:</label>
        <input
          type="text"
          id="petName"
          name="petName"
          value={petName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="animalType">Animal Type:</label>
        <select
          id="animalType"
          name="animalType"
          value={animalType}
          onChange={handleInputChange}
        >
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="turtle">Turtle</option>
          <option value="bunny">Bunny</option>
        </select>

        <label htmlFor="dietType">Diet Type:</label>
        <select
          id="dietType"
          name="dietType"
          value={dietType}
          onChange={handleInputChange}
        >
          <option value="dogfood">Dog Food</option>
          <option value="catfood">Cat Food</option>
          <option value="veggies">Veggies</option>
          <option value="carrot">Carrot</option>
        </select>

        <label htmlFor="exercise">Exercise Level:</label>
        <input
          type="range"
          id="exercise"
          name="exercise"
          min="0"
          max="100"
          value={exerciseLevel}
          step="1"
          onChange={handleInputChange}
        />
        <span id="exercise-value">{exerciseLevel}</span>

        <br /><br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default PetForm;
