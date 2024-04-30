1. A brief description of what you created, and a link to the project itself (two paragraphs of text)


We created an interactive online website for users to play chess matches. When a user loads onto the website, they are brought right to the matchmaking page. The user is assigned a user ID number which is displayed and used to create a match. The user also has a record displayed originally starting at 0/0/0 indicating no wins, draws, or losses.  If there are no matches availible they have the option to hit the "Create Match" button to create a new one. 

Once in a game, both users can play a chess match updated in real time following all rules which is powered by the chess.js library. At any moment in the game a user has the option to resign which ends the game immediatley and brings the users back to the matchmaking page. A user can also offer a draw which upon accepting will also end the game and return the users back to the matchmaking page. Once games have officially ended through wins, resignations, draws then their record is automatically updated and displayed. 
Website Link: https://cs4241-chess.onrender.com/ 

2. An outline of the technologies you used and how you used them.

We used React for the front end building the UI. State management is handled via React's context API and hooks, ensuring that the state of the chess game is synchronized across components without unnecessary performance bottlenecks. On the server side, the chess gameplay is powered by Express.js like I mentioned earlier. Express.js handles all backend routing and serves as the intermediary between the frontend and the MongoDB database. It processes game moves and other requests, forwarding them to MongoDB where user record and game states are stored. Real-time communication is facilitated by Socket.io. It enables real-time, bi-directional communication between web clients and servers with WebSocket as the communication protocol. When a player makes a move, the move is sent to the server via a Socket.io event, which then updates the game state in the MongoDB database. The updated state is then broadcasted to all connected clients through Socket.io, ensuring that all participants and viewers of the game see the move instantly. 

3. What challenges you faced in completing the project.

The largest challenge we faced was the integration of Github OAuthentication. We were able to get it to work for a log in page and then route to the matchmaking page upon successful login, however we were not able to integrate the github users into the gameplay. By that I mean we were unable to (in the given time) make it so instead of a random user ID number given to each person who loads the website, each user would be pulling their github identification from the login and using that to compete in chess matches.

4. What each group member was responsible for designing / developing.

Stephen is responsible for the chess logic and mongoDB integration, Owen is responsible for the Github OAuthentication and the matchmaking was a combined effort.

5. What accessibility features you included in your project.
Accessibiltiy features include color contrast throughout the website and a large text size. 
