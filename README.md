CampusConnect
===
## Andrew Salls, Nora Cleary, Ellys Gorodisch, Era Kalaja

https://campus-connect-9c83.onrender.com/

Our application is called CampusConnect, it is an application designed specifically for WPI students to get more involved on campus via club engagement or to help students meet others informally through a posting board. CampusConnect covers 3 key functionalities for WPI students: allowing students to post messages about classes, meetings, social events, or just needing some one to get dinner with; allowing clubs and students to create public events on a calendar, streamlining club evebt attendance; and allowing students to create their own personal calendars from the list events on the public calendar. This site acts as an accessible social media page for WPI students and helps connect our campus members with one another. 

This application challenged our skillset, as we explored new technologies, such as websockets and OAuth implementations. We used OAuth authentication via GitHub and Google authentication. To do this we used passport.js and protected the client ID and secret in the .env file. Because of the multiple pages interacting with eachother, we faced some challenges with cookies. To get familiar with the implementation of cookies, as we all were unfamiliar with this feature, we used a combination of the inclass code cookie example to understand whether a user is logged in or not to ensure that only logged in users have acccess to profile page.
Before starting any code, we established a general form of sending and reciving JSON in order to avoid any conflicts when we merged our code. Because we made this guideline, we faced minimal challenges in merging our code. 

Additional information
---
- Login with either a github account or google account to access the site. Use the menu buttons to navigate across pages.

Technologies
---
- Vite express - server.
- Mongodb - stores the events, account information, posts, personal calendar preferences
- OAuth strategies (Github, Google) -  allows users to quickly login and creates account for first time users
- Websockets - Message board to show real time posts.
- Quill.js - Code block in message board
- highlight.js - Code block in message board

Challenges
---
We faced a few challenges with the personal calendar and events calendar. While creating and storing events were easy enough we were challenged by the functionality to add an event from the public calendar to your personal calendar. Furthermore, these pages showed complications when trying to prevent 2 events from occuring at the same time and location. Additionally, adding a flyer to be visible in our application for club ads was another challenge we tackled in respect to the events boards. 

We also faced challenges with the message board, where the posts wouldn't display the correct username, we spent time understanding how we could pass in a username through the websocket function to correctly display which user posted which message.   

Switching from local host to a hosting site caused some issues. The upload image image feauture is fully fuinctional, however, we cannot use it on our hosting site, render, as it is a paid feauture. Similarly, we initially tried to host our site on Glitch, however, our project requires versions of node that Glitch does not support. Instead, we used Render.

Responsibilities
---
- Message board functionality: Era and Andrew
- Personal calendar: Ellys
- Register events and view event calendar: Nora
- Login page: Era
- Styling for whole application(css/html): Andrew 

Accessibility Features
---
- Colors that are visbile for all
- Can tab to select the buttons
- Dark mode vs light mode
- Appropriate font and font size (readable)
- Proper color contrast
- Clear directions

We had to explore new technologies in order to make navigating the site more accessible. We wanted to implement a keyboard feature so the user can use the tab key to select a button. After some research, we were able to implement this feature in the HTML and make the site more accessible.
