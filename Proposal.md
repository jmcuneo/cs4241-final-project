# Project Proposal #

Team 1 - Milo Jacobs, Nate Westfall, Connor Peavey, Bashar Alqassar

Approximate Whomst is a two-player webgame based on Guess Who. Instead of guessing between original characters, players instead need to guess items or characters from various video games or other fandoms. We will start with Pokémon and Minecraft items and potentially include things like Terraria items and Slay the Spire relics. We’d also like to have compatibility with user-inputted sets of images. 
	
The main features included in the game will be hosting and joining two-player games in both public and private lobbies, a random assignment of a character, a chat feature that players can use to ask each other questions, a “flipping” system for users to eliminate options, and an “official guess” feature. The official guess feature sends a message in chat when it is used, ends the game if the player is right, and permanently flips the option if the player is wrong. For the user-inputted boards, players input at least 24 different image URLs and a label for each one, they will be stored in the backend database, and other players can create games using their boards.
	
For technologies, we’ll be using Node.js with express as a backend, MongoDB to store persistent data, socket.io for client/server communication, and Svelte. Full compatibility with user-submitted boards is a stretch goal, but if we fully implement it we will use passport for Github authentication. 
