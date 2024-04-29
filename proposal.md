### Magic the Gathering Game Manager

This project consists of a web application that will keep track of game-related data for people playing a game of Magic the Gathering. Much of the game functionality will involve keeping track of life totals, as well as other effects that occur during the game. Much of these game computations will occur client side, utilzing JavaScript. Persistent storage will occur has players complete games, and will have the option to log the results of the game. This information will be logged server side using a persistent data storage application, with the server automatically computing win rates and statistics.

**Client side functionality**
- Keeping track of game setup, including the # of players
- Keeping track of player actions, updating the server to match the inputs
- The app itself will not have to manage the actions/consequence of these effects, only that they have been applied. Actual gameplay will resolve on the real table top

**Server side functionality**
- Updating game progress in real time
  - Keeping track of the life total of each player
  - Keeping track of whether a player has lost the game
  - Keeping track of other status effects and values for each player
  - Keeping track of logged in players
- Keeping track of player game history
- Keeping track of win/loss statistics

**Pages in Application**
- Login page
- Home page
  - Create game
  - Join game
  - View user game statistics

**Software Used**
- Html/Css/JavaScript for client and server functionality
- MongoDB for persistent game information storage
- Glitch(?) for web hosting