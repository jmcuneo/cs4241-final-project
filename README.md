### Event List Site
Note: Look at [proposal.md](proposal.md), not this README for the proposal submission.

# Notes for the video (delete later)
A video (less than five minutes) where each group member explains some aspect of the project. An easy way to produce this video is for you all the groups members to join a Zoom call that is recorded; each member can share their screen when they discuss the project or one member can "drive" the interface while other members narrate (this second option will probably work better.) Upload the video to Canvas. (Further instructions are available in the Canvas assignment.) Make sure your video is less than five minutes but long enough to successfully explain your project and show it in action. There is no minimum video length.

# README
__Project link__: https://cs4241-final-project-zzsv.onrender.com

## Project Description
We created an Event Management web application. It is a platform designed to create an event, invite guests, and manage event and guest details. Users can register, invite guests, uninvite guests, and view the guest list for an event. Admins have an expanded set of abilities including being able to create events, manage guest lists, change event details, invite users to an event's list, and assign admin to users.

The purpose of this project was to create a website for a local WPI community to more efficently organize events for their members. The idea is for the community leaders to be the admins and manage the events, while the community members sign up to be users. These users can write the name of guests they choose to bring, whether they are part of the community or not. The user's password are protected and remembered in the database, however the admins would be able to view the user's name. 

## Instructions & Login Information
Login:
- Username: mmouse
- Password: !123

- Username: dduck
- Password: !123

Note: The "mmouse" account has more pages to view and addtional management features.

Follow the buttons to edit events/add guests/delete guests. 

## Outline of Technologies Used
- __React__: Used to make all page components 
- __Mongoose__: Made schemas and hold all user data
- __Three.js__: Added animations to site
- __Passport__: Used for adding authentication for login

## Challenges
One challenge we ran into was authenicating login for everyone on the team; sometimes there would be fetching issues while logging in even if no code has been changed. We also had difficulty deploying the project since we built the entire project before trying to host. Problems of any kind that arose were resolved by working together and communicating with each other so that multiple pairs of eyes were looking for bugs or issues. 

## Group Responsibilities
- __Alexander Beck__: backend - made database and created all necessary api calls
- __Jayson Caissie__: frontend - used Framer motion to make the animations on the site, added search and scroll ability to tables, implemented user authorization.
- __Carlos Medina__: frontend - created table components and scroll capabilties, navbar, added tailwind and css for styling, format pages
- __Olivia Perez__: frontend - assisted with adding navigation, addGuest capabilities, guest list components, and readme
- __Jack Weinstein__: frontend - created project/start code, page navigation, page components, registration, format pages

## Accessibility Features
Make a case for why what you did was challenging and why your implementation deserves a grade of 100%.
- Lighthouse test?
- color scheme and legible font

