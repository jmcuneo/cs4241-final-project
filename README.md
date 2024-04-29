# Approximate Whomst
[Approximate Whomst](https://approximatewhomst.onrender.com/) is a two-player webgame based on *Guess Who*. Instead of guessing between original characters, players instead need to guess either Pokémon or *Minecraft* items. Stretch goals included support for custom types of game for various other video games and fandoms, but for our project we stuck with just these two. Players are given 24 random images and names, two of which are assigned to be each player’s “secret”. The goal of the game is for players to take turns asking each other yes or no questions via chat to narrow down their options and eventually guess the opponent’s secret. When players are ready to make an official guess, they can right click what they think their opponent’s secret is. If they’re right, they win the game!

The main features included in the game are be hosting and joining two-player games in private lobbies, giving players in those lobbies a randomly selected assortment of 24 images from a database, a random assignment of an item to guess, a chat feature that players can use to ask each other questions, a “flipping” system for users to eliminate options, and an “official guess” feature, which sends a message in chat when it is used, ends the game if the player is right, and permanently flips the option if the player is wrong. It also includes a game over screen which tells both players the correct answer and features a “Play Again” button so that players can easily start a new game.

# How to Play/Use: 

*Approximate Whomst* is a 2-player Guess Who-like game, where players take turns asking and answering yes/no questions to nail down what character or item they other player is trying to have them guess. 

1. Enter a room code in “Host Game” and press enter
2. Give the code to a friend for them to enter in “Join Game” and press enter
3. Use the provided chat (or talking in person or on a call), taking turns answering yes/no questions
4. Click on Pokemon/Items to mark them to keep track of what you are NOT trying to guess
5. When you are ready to submit a guess, right click a Pokemon/Item and select “yes”
6. The player who guesses correctly wins! 

*Approximate Whomst* uses a database to keep track of games, each with a registered room code users can share with others. There is no formal login system required to play the game.

# Technologies Used:

We used Svelte for program design on the client. Each page of the app had a component that handled the logic of that page. We used sass for css styling. This was done to make the complicated card css easier to read and was overall helpful in readability. We are using MongoDB for the database. We stored the Pokemon and Minecraft items there as well as data for currently running games needed such as the chat, board, players, and flipped and guessed cards. Our server was built in Node.js as required. Socket.io was helpful to send messages between the client and the server. We ended up hosting the project on Render.

# Challenges Faced:

## Leaving and Rejoining

One challenge with implementing any multiplayer game is handling disconnections. Theoretically, either player can disconnect at any time, and the server needs to be at least somewhat prepared for that scenario. We made a system that should make the game fairly robust in handling disconnects. The server keeps track of a socket id for a “Player 1” and a “Player 2”. If a player leaves, the corresponding element in the database is set to null. If a new player joins, they will attempt to join as Player 2 by default, but if a player 2 is already in the game, they will join as Player 1. While only one player is in the game, any official guesses made will not count, but the remaining player can still flip cards and send messages in chat. When a player rejoins, the client syncs with the server, restoring whatever cards they had flipped and any messages previously sent in chat.

## Populating Databases

With over 1,000 Pokémon and hundreds of Minecraft items we wanted to include in the database, adding them all manually would be way too much of an undertaking. We instead decided to write a Python script for Pokemon and a JavaScript script for Minecraft which could add these values in bulk. We downloaded lists of every Pokémon and Minecraft item, and used this script to populate the database with not just the names, but a unique ID and link to a corresponding image to display as well.

## Database Organization

The only problems on the DB mostly came from the occasional hardcoded fetch case, all left over from early testing, but easily abstracted and removed once more feature visions became final. I’m particularly proud of the organization on the DB, there was an abundance of information related to gamestate, and the Minecraft and Pokemon collections being so similar allowed for easy abstraction between them to support them both as their own game modes (and lay the groundwork for future expansion). Game objects storing references of Pokemon/Minecraft objects was also a highlight technical feature.

## Card CSS

Getting the Css on cards to work was very hard. Each card had three states: regular, flipped, and permanently flipped. A card was made up of three elements, each of which needed their own css for each state. Plus, one card, the card the other player needed to guess,  got a gold border which also needed to change. Each state also needed to change on hover. Once clicked the hover events needed to stop until the mouse left the card. I added sass to be able to use the ampersand syntax to make the css clearer and more readable.

# Group Responsibilities

**Milo** was in charge of the server.js file, which handled the socket.io requests. This served as a communication link between the client, the server, and the database.

**Nate** majorly worked on the Client with Svelte doing the HTML, CSS, and JavaScript. He also did miscellaneous work on the server.

**Bashar** handled Database communication between the Server and the DB, which primarily consisted of the database.js file. He also set up the structure for Card objects (of type Pokemon and Minecraft) to store information for a particular card (like Pikachu), and a structure to hold all game objects so the current game state can be stored on the DB to be fetched from both players. 

**Connor** populated the initial database, worked on initial client game setup, and made some of the communication between the server and database.

# Accessibility

All pages of Approximate Whomst score 100% in the accessibility section of Google Lighthouse tests. We achieved this by labeling all form elements, providing sufficient contrast for all text elements (including changing the color on already-guessed cards so that the name is still readable), and providing titles for the pages. 

# Conclusion

We believe we deserve a 99.99% exactly in the project due to the copyright infringement of using intellectual property from the *Pokémon™* and *Minecraft™* games. Such a terrible crime cannot go unpunished, so we must lose 0.01 points for it.

Joking aside, we enjoyed making this, we think it was sufficiently challenging and sufficiently creative, and we look forward to playing it with our friends once finals are over!
