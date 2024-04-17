import React, { useState } from 'react';


function Results({ formData  }) {
    return (
    <div id="results">
        <h1>Race Results</h1>
        
        <div id="your-pet">
            <h2>Your Pet!</h2>
            <p>Name: {formData.petName}</p>
            <p>Animal type: {formData.animalType}</p>
            <p>Diet: {formData.dietType}</p>
            <p>Exercise level: {formData.exerciseLevel}</p>
            <p>Race time: </p>
        </div>

        <div id="leaderboard">
            <table>
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
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default Results;