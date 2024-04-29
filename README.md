# Word Chain
Team members: Lucas Sicard, Yuran Xue, Trevor Ng , Jay Hokkanen, Nicholas Whalen

Here is our project deployed to Render: [WordChain](https://cs4241-final-project-6qnt.onrender.com/)


## Porject Description
For our final project, our group developed a web game called Word Chain. The game works by providing the player with a starting word, which they then have 10 seconds to come up with another word beginning with the last letter of the previous word. The words must be a minimum of 4 letters in length, and words cannot be repeated. Upon submitting a valid word, the player gains points equal to the number of letters in the submitted word. If the player runs out of time before their next word is submitted, the game ends and they can then submit their score to the leaderboard by attaching a username. 

The leaderboard functions similarly to a traditional arcade machine, showing the top scores and names out of all games played. All scores are stored in a MongoDB collection. 


## Project Instructions
Our project is hosted on Render.com at [WordChain](https://cs4241-final-project-6qnt.onrender.com/) and does not require any additional instructions to use. 

## Technologies
Word Chain’s frontend was developed using Vite as our compiler, React.js for our UI, TypeScript as our primary language, and Axios for our node server queries. We chose to use React as our UI for its simplicity and quick performance. React’s libraries helped our group quickly implement features for our project, such as useStates and useQueries. Our group chose to use TypeScript over regular JS at the start of our project, although we didn’t end up needing many of its features. The backend of Word Chain was built on Express, Node JS, and MongoDB. This stack was very familiar to all group members, and each component had plenty of resources available. Everything worked well with what our needs were for this project. 

## Challenges
Our project faces several critical challenges. Firstly, merge conflicts occurs when we made conflicting changes to the same line of code, resulting in significant time spent manually resolving them. Secondly, we encountered persistent errors stemming for the node_modules during our operations. We conducted troubleshooting and maintenance to address these issues. Lastly, achieving parity across diverse browser and devices presents ongoing challenges in ensuring consistent user experiences.

## Responsibilities
Our project benefits from a well-coordinated team effort, with each member taking on specific responsibilities. Lucas is tasked with setting up MongoDB, managing pull requests, and resolving bugs. Yuran is responsible for start word function, designing the layout, debugging, and contributes to the README documentation. Trevor focuses on implementing the Word Checking function. Jay is in charge of developing the Scoreboard feature and deploying the site to Render. Nick handles username validation, debugging tasks, and contributes to the README documentation. 

## Accessibility Features
Our project incorporates various accessibility features to ensure an inclusive user experience. Including clear game instructions, an alert system designed to remind players to input words and name correctly, implementation of ARIA for enhanced dynamic content accessibility, and high contract colors for improved visibility. These features collectively aim to make out application accessible and usable for all players.
