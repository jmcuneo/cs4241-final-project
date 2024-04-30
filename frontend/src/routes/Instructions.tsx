import React from 'react';
import img1 from './img1.png';
import img2 from './img2.png';

function Instructions() {

    return (
        <main className="p-5 overflow-y-auto flex flex-col justify-center items-center align-items-center text-center rounded-full">
            <div
                role="region" aria-label="Instructions"
                className="overflow-y-auto text-white h-400 w-10/12 font-bold h-400px bg-gradient-to-r from-black to-green-500 p-8 bg-green-300">
                <h1 className="text-4xl">Instructions</h1>
                <hr/>
                <h2 className="text-xl underline">Navigation</h2>
                <ul>
                    <li>Login using your GitHub account</li>
                    <li>After successful login, you will land in the login success page that displays the user's
                        information
                    </li>
                    <li>Use the button on that page to go the game page or use the navigation bar on the top</li>
                    <li>The logout button will log you out and return back to the homepage</li>
                </ul>
                <hr/>
                <h2 className="text-xl underline">Playing The Game</h2>
                <ol>
                    <li>Click the play button and the timer will start</li>
                    <li>Click on one tile to open it and see the content</li>
                    <li>Click on another tile to open it</li>
                    <li>If both the opened tiles have the same content then they are matched set and greyed out</li>
                    <li>If the tiles do not match, both the opened tiles will automatically close</li>
                    <li>Repeat the process until you clear out all the pair of tiles</li>
                    <li>After the game is completed, an alert is thrown with the time taken to complete</li>
                    <li>BE SURE TO REMEMBER WHAT'S IN THE TILES!!!</li>
                </ol>
                <img className="images" src={img1} alt="Non-matching tiles"/> <img className="images" src={img2}
                                                                                   alt="Matched tiles"/>
                <h3 className="text-xl underline">Difficulty Levels</h3>
                <h6>There are 3 different difficulty levels, each level has a different size of board</h6>
                <ol>
                    <li>Memory-Easy - Board dimension = 4 x 3</li>
                    <li>Memory-Medium - Board dimension = 5 x 4</li>
                    <li>Memory-Hard - Board dimension = 8 x 5</li>
                </ol>
                <hr/>
                <h2 className="text-xl underline">Scoring The Game</h2>
                <ul>
                    <li>The score is calculated based on the time taken to complete the game</li>
                    <li>The leaderboard displays a few top players with highest scores respective to each difficulty
                        level
                    </li>
                </ul>
                <hr/>
                <h2 className="text-xl underline">Multiplayer</h2>
                <ol>
                    <li>Two players can play together</li>
                    <li>The second person plays first by opening a pair of tiles</li>
                    <li>If matched the player gets a point and both the players can see the tiles greyed out, else the
                        tiles close back
                    </li>
                    <li>The first person plays next</li>
                    <li>Both players keep playing until game finishes</li>
                    <li>The player with highest points wins</li>
                </ol>
            </div>
        </main>
    );
}

export default Instructions;
