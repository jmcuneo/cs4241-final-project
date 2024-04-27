# Project Proposal
Stephen Fanning - Owen Lehane

This project will be a fully functional chess website in which you can play a game of chess against anyone else on the website. The website will primarily use a React front end, with an Express server for the back end, and a MongoDB database. Given that we are a group of two, we will focus on a few points of basic functionality for the website, and we will expand to more features if time allows. The basic functionality we will implement is as follows:

- **Login Page**: The app will utilize Github Authentication to allow users to log in within a basic login page. Their Github account will then be used to distinguish them from other users. 
- **Matchmaking Page**: This page will show a list of available game rooms and allow users to join game rooms to start a game of chess. It will also allow users to create their own game room, allowing other players to join it.
- **Game Page**: This page will facilitate the actual gameplay between two players. Thankfully, there are a number of pre-existing chess libraries that we can use, meaning we should not have to reimplement the entire game of chess. This page will allow a complete game to occur, including updating the board state for both players as moves are made, and allowing either player to resign at any time. Once a game is complete, it will update the playes' win/loss record (which will be stored in the MongoDB database) and then return both players to the matchmaking page.

