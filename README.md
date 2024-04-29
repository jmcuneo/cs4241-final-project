## Brief Description

Our group created our own hosted game, sᴉɹʇǝʇ. This website consists of three pages, all of which have a navigation menu at the top to allow the user to navigate between all three pages. The first page is a login page that comes with instructions on how to log in, and the user is not able to navigate to any other page on the site until they have successfully logged in. The second page is the main page of the site where you are able to play Tetris or sᴉɹʇǝʇ depending on the current active mode you can dictate via the buttons below the game window. The final page is a leaderboard page that displays multiple statistics. The first statistic is the top 10 scores achieved on the game in descending order, with medals displayed for the top 3 users, if there's that many on the leaderboard. Additionally, the currently logged in user's top score will be displayed at the bottom of this table, along with their associated rank so if the user logged in is not in the top 10, they can still see their ranking for their top score.

## Project Website:

https://cs4241-final-project.onrender.com/

## Additional Instructions

**Login Instructions:**\
In order to log in to this application, you can enter any username you want, and give it a password you will want as well. This account will be automatically created but have no data associated with it.\
_NOTE:_ If you would like to log in to an account with data already set up, the username TestingUser and Password Testing is already set up with some dummy data entries.\
**Gameplay Instructions:**\
Once on the game page, you must press `s` to start the game.\
sᴉɹʇǝʇ is enabled by default, click the 'Normal Mode' button to play Tetris, and press the 'Silly Mode' button to swap back to sᴉɹʇǝʇ.\
`<` to move a piece to the left\
`>` to move a piece to the right\
`z` to rotate a piece counterclockwise\
`x` to rotate a piece clockwise\
`↓` to soft drop a piece\
`space` to hard drop a piece\
`r` to reset the board

## Technology Outline:

**Render:** We hosted our site on Render.com instead of Glitch.\
**JavaScript:** We used JavaScript for the core of our game and and score page. For the main.html page, we utilized JavaScript classes to create a Board, Cells, Piece, and Next Types. These objects were used in conjunction to simulate a Tetris game. The Cell objects are the (x, y) coordinate grid spaces in the Tetris board. The Piece objects are used to instantiate any Tetris piece that can be placed on the board (Z, S, J, L, I, O, T). The Next class maintains a pieceQueue of pieces to be spawned and handles the logic to display the next 5 pieces in the sidebar. The Board class includes elements from each of the other classes and handles placement, movement, row clearing, difficulty scaling, game over, and scoring. Lastly for the main page, we used JavaScript to track the user's current score and pull their highest score from the database, as well as event listeners to handle keyboard control of the website.\
**MongoDB:** We used MongoDB as our database to store the login accounts and scores from these accounts. Scores are automatically populated into the database upon the game reaching its 'game over' state.\
**Node-Express:** We used a Node.js Express web-server to serve our application, where we used their Handlebars as a way to send messages to the pages upon logging in to the application.\
**Bootstrap:** We used Bootstrap almost exclusively as our way to style our website, with only a small handful of stylings handled in the main.css file.

## Challenges Faced:

Most of the major challenges our group faced came up when we were initially implementing the logic of the game and the core gameplay loop. Different members of the team had worked on different aspects of the game, so when we started to connect all that logic together there were a number of bugs we had to spend time ironing out. In particular, piece movement, placement, and rotation were challenging for us to figure out at first, as well as properly detecting pieces that were out of bounds. We also had some bugs related the score submission and displaying the scoreboard that were a bit challenging to figure out.

## Group Member Contributions:

**Austin Rebello**: Set up the base shell of the project, including the 3 base HTML Handlebars pages and their connectivity to one another. Worked on the navigation bar and its functionality and styling. Developed the JavaScript for the login.html and scores.html page, as well as the design of both pages. Assisted in the development of the game functionality and debugging of the piece movement and placement. Set up the databases and their connections, as well as the current score / high score functionalities on the main game page.<br><br>
**Brianna Sahagian**: Set up Tetris database and collections on MongoDB. Implemented piece configurations and worked on rotations, motion, and piece spawning via the queue. Added instructions, 'game start' logic, local and global high score alerts, and game over alert. Implemented difficulty scaling based on 'levels' and rows cleared for faster piece drop rates. Worked on Guest profile display and introduced some interactive elements to main.handlebars.<br><br>
**Darren Ni**: Created the two html canvas elements, along with the `Board` and `Next` classes to control the logic within the canvases. Used x and y offsets with `cellSize` to draw the grid background in the Board in the `drawBackground()` function. Created the `Piece` class along with its subclasses, and worked on the `draw()` function to allow each pieces to render themselves. Created the `hardDrop()` and `softDrop()` functions within the `Board` class, and implemented them in the game, and also made the two buttons to change mode (Normal Mode and Silly Mode).



**Parker Frizzle**: Added majority of logic related to the game board and its cells and assisted with piece logic. Implemented logic to handle interactions between the active piece and the game board, such as piece collision, boundary detection, loss detection, and line clear logic. Implemented main game loop and animation logic. Found and added colorblind-friendly palette for game pieces. Tested and debugged site, especially game functionality.

## Accessibility Features:

We have scored a 100 on Google Lighthouse on all three pages for accessibility. We have added alt text to all images. We also implemented colorblind friendly for the game page since the base Tetris piece colors are affected by those who may be colorblind. This mode changes the colors of specifically the pieces of the game. To further assist with user accessibility, we used high contrast colors on the rest of the site.
