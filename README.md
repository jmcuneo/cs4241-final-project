# Final Project Group 6

# README Start
For our project, we created an LGBTQ+ themed matching game which matches famous queer people with events or activities they were apart of. We also implemented a login page which allows for custom user signups, GitHub authentication, or a guest login. Users that complete the game while logged in with either of the first two methods will automatically have their score uploaded to our leadboard database which is also shown on the page. 

The frontend of the site is written in basic JavaScript with CSS designing mostly completed in Bulma. The server backend was written with Express with aid from the Passport.js library for integrating OAuth authentication. Our database was a single MongoDB Database with multiple collections inside.

## Achievements

- MongoDB Integration: We implemented multiple collections within MongoDB which keep track of users, the information on the matching cards, as well as the current leaderboard of all player scores. 
- GitHub OAuth Integration:
- Perfect Lighthouse Score: We checked the Lighthouse score of our project throughout development and changed our project as needed (often adding accessibility improvements) to achieve a 100% on all 4 Lighthouse tests. A screenshot of the score has been added to the repo.
  [Score](lighthouse score.png)
- Deployed on a Digital Ocean Droplet instance. HTTPS was handled using certbot and the automated walkthrough. PM2 manages daemonization of the server.

## Challenges
- OAuth:
  - OAuth and Github presented a challenge in that the documentation for many API's is not beginner friendly. For example the GitHub Api documentation for fetching all of a users emails, regardless of whether they are public are private required some information being passed to a Post endpoint in the URL, which seemed unintuitive and took trial and error to figure out. Figuring out how the logic flowed was also challenging, from the callback page, where should the user go. Then there was trying to preserve the JWT cookie through multiple redirects, which ended up plain not working. The solution that was determined was to store the cookie in localStorage and delete it once it was copied into the cookie. Given another opportunity localStorage would be used and cookies would not. As it stands the solution is somewhat redundant, but works.
  - In order to login using github credentials a user must first have an account where the email is one associated with their github.

## Group Contributions

# Ivy Bixler
- Research
- Auth Implementation
  - Bcrypt
  - JWT
  - Oauth
- Endpoint layout
- Deployment

# Ava Chadbourne
- Research
- Visual layout of elements
- Using Bulma to style webpage
- Interaction with gameboard elements
- Information display
- Client-side login handling

# Nat Dynko
- Research
- Website Map Base 
- Backend Server Game Logic
- Data Transfer between Client - Server - Database

# Luca Wol 
- Research
- Created Card Object for People and Events for the Database
- Formatted Research into Card objects
