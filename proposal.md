# Project Proposal

We are developing a game of Word Chain for our website. In this game the user will be given a word that is four or more 
characters & they will have to type in another unique word within 10 seconds. The word is meant to be at least four 
characters in length as well, not already in the chain, & start with the letter of the last letter of the previous word. 
For example, if the game starts with apple, then a valid next word could be elephant because apple ends with “e” & 
elephant begins with it.

The player is able to keep going with these words until he/she can’t find a word within 10 seconds of typing the 
previous word. The player also gains points for each word typed based on length of the word. Once the player has 
inevitably run out of time, the player is then able to input their name & submit their score. The scores are collected 
with usernames attached for a high score board.

We will be using Vite to create a React-Typescript based web application. We will also be using MongoDB to store the 
scores on a database & retrieve them for our users to see. We won’t have passwords, but will require users to input a 
different username than what is already in the database.
