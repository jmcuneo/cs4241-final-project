##Group Members: Andrew Salls, Nora Cleary, Ellys Gorodisch, Era Kalaja
##Application: CampusConnect##
Hosting link: https://campus-connect-9c83.onrender.com/

#A brief description of what we created:
    Our application is called CampusConnect, it is an application designed specifically for WPI students to get more involved on campus via club engagement or to help students meet others informally through a posting board. CampusConnect covers 3 key functionalities for WPI students: allowing students to post messages about classes, meetings, social events, or just needing some one to get dinner with; allowing clubs and students to create public events on a calendar, streamlining club evebt attendance; and allowing students to create their own personal calendars from the list events on the public calendar. This site acts as an accessible social media page for WPI students and helps connect our campus members with one another. 

#Additional information: 
    Login with either a github account or google account to access the site. Use the menu buttons to navigate across pages. 

#Technologies used: 
    Vite express - server. 
    Mongodb - stores the events, account information, posts, personal calendar preferences
    OAuth strategies (Github, Google) -  allows users to quickly login and creates account for first time users
    Websockets - for the message board to show real time posts. 

#Challenges: 
    We faced a few challenges with the personal calendar and events calendar. While creating and storing events were easy enough we were challenged by the functionality to add an event from the public calendar to your personal calendar. Furthermore, these pages showed complications when trying to prevent 2 events from occuring at the same time and location. Additionally, adding a flyer to be visible in our application for club ads was another challenge we tackled in respect to the events boards. 
    We also faced challenges with the message board, where the posts wouldn't display the correct username, we spent time understanding how we could pass in a username through the websocket function to correctly display which user posted which message.   

#Group member responsibilities: 
    Message board functionality: Era and Andrew 
    Personal calendar: Ellys 
    Events calendar: Nora
    Login page: Era
    Styling for whole application(css/html): Andrew 

#Accessibility features: 
    - Colors that are visbile for all 
    - Can tab to select the buttons
    - Dark mode vs light mode 
    - Appropriate font and font size (readable)
    - Proper color contrast
    - Clear directions 
