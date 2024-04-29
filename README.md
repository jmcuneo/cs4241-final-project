# Magic: The Gathering Tracker

[Project Link](https://mtg-app.glitch.me/)

## General description
- A video (less than five minutes) where each group member explains some aspect of the project. An easy way to produce this video is for you all the groups members to join a Zoom call that is recorded; each member can share their screen when they discuss the project or one member can "drive" the interface while other members narrate (this second option will probably work better.) Upload the video to Canvas. (Further instructions are available in the Canvas assignment.) Make sure your video is less than five minutes but long enough to successfully explain your project and show it in action. There is no minimum video length.

## Description
Our project is a web application to facilitate playing in-person games of the card game Magic: The Gathering. While the game itself is played in the real world, there are many values and variables that must be recorded and changed as the game progresses. The primary purpose of the web application is to manage all of these variables. In addition, our application will allow multiple users to log in and play othe same game, with each user able to view and play the game from their own device. The game will update in real time, displaying up-to-date information to each player.

Our application also allows users to view their own game statistics. As the players log in using GitHub, the application will record the results of each game upon completion, creating a list of statistics that players can view in their profile.

## Instructions

To log in to the website, players log in using GitHub. The webpage will redirect you to log in if you haven't logged in already, as well prompt you to approve the application within your GitHub.

Sometimes Glitch will bug out and cause an error. We're not quite sure what causes this, but restarting the website has usually fixed this for us in the past.

## Technologies

We used GitHub OAuth in order to authenticate users for the application. This authentication happens on the server, from which we store each user's GitHub info as a cookie within each client's session. This cookie is referenced for all of the functionality that requires user info. For our profile stats page we implemented D3, a data visualization library in javascript. D3 allowed us to make a variety of charts to show player win percentage, win rate over time, and player placement history. We used websocket to synch each player's game screen. If one player's status changes, it would update everyone's screen.

## Challenges

We initially faced issues with getting our Database and OAuthentication functionality to work with vite-express. Thus, an early decision was made to cut vite-express from the project. Though Svelte by itself wasn't a source of any issues, we chose to pursue a basic html/css/js page to simplify the process.
We also discovered that much of our functionality relied on each client session remembering which user was logged into that session. This necessitated the usage of cookies in order to record user data to each session, as the server would constantly change whenever someone else logged in.

## Division of Labor

Jack Lafond: Helped with server set up, stats page, helped with CSS styling and html pages

Aidan MacNevin: Database connections and management, Leaderboard, Game Page CSS styling, HTML/CSS formatting

Edison Zhang: Websocket, game functionality, createGame javascript

Bryon Tom:
OAuth functionality
Cookies
Login/Home Page
Html/CSS formatting

## Accessibility
Visually distinct color scheme.

1. A brief description of what you created, and a link to the project itself (two paragraphs of text)
2. Any additional instructions that might be needed to fully use your project (login information, etc.)
3. An outline of the technologies you used and how you used them.
4. What challenges you faced in completing the project.
5. What each group member was responsible for designing / developing.
6. What accessibility features you included in your project.

Think of 1, 3, and 4 in particular in a similar vein to the design / technical achievements for A1—A4. Make a case for why what you did was challenging and why your implementation deserves a grade of 100%.

The video described above is also due on Canvas at this time.

## FAQs

**Can I use XYZ framework?** 

You can use any web-based frameworks or tools available, but for your server programming you need to use Node.js. Your client-side scripting language should be either JavaScript or TypeScript. Note that the staff may not be able to assist with TypeScript questions.
