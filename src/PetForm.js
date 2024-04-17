import React, { useState } from 'react';
import Results from './Results';

function PetForm() {
  const [formData, setFormData] = useState({
    petName: '',
    animalType: 'dog',
    dietType: 'dogfood',
    exerciseLevel: 50
  });
  const [submitted, setSubmitted] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Do something with the form data, like submit to a backend API
    console.log('Form submitted:', { formData });
    setSubmitted(true);
  }

  if (submitted) {
    return <Results formData={formData} />;
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
          value={formData.petName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="animalType">Animal Type:</label>
        <select
          id="animalType"
          name="animalType"
          value={formData.animalType}
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
          value={formData.dietType}
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
          value={formData.exerciseLevel}
          step="1"
          onChange={handleInputChange}
        />
        <span id="exercise-value">{formData.exerciseLevel}</span>

        <br /><br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

async function submit(event) {
  event.preventDefault();

  const petName = document.querySelector("#petName").value,
    animalType = document.querySelector("#animalType").value,
    dietType = document.querySelector("#dietType").value, 
    exercise = document.querySelector("#exercise").value, 
    json = {
      petName: petName,
      animalType: animalType,
      dietType: dietType,
      exercise: exercise 
    },
    body = JSON.stringify(json);

  const response = await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  document.querySelector("#petName").value = "";
  document.querySelector("#animalType").value = "";
  document.querySelector("#dietType").value = "";
  document.querySelector("#exercise").value = "";
  getApplications();
}

export default PetForm;
