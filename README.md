CS 4241 Webware Final Project – Group 12: Andres Negron – Patrick Hunter – Szymon Mamro


Live site: https://cs4241-group12-final.glitch.me
Repository https://github.com/pehunter/cs4241-final-project 
Video https://drive.google.com/file/d/1x-6Se8IwHV9Yk38J6draarGvKzwtyS_x/view?usp=sharing 

Description: A game based on “Cookie Clicker”, but geared towards WPI students. The goal of the game is to make GoatBucks by clicking the GoatButton in the middle. You can use your GoatBucks to invest in WPI restaurants to generate GoatBucks quicker. Get as many as you can!
Typically these games are endless, but your time at school isn’t, so once you get the maximum upgrades before you reach the end of your “senior year” (one minute timer per year), then you graduate on time and win! If not, it’s game over.

Login instructions: enter any username and password (if entering one for the first time, it prompts you to create it, previous ones are saved to the server and can be accessed again). The game starts once you log in and you can see all your users’ high scores if available and log out.

Challenges and how we overcome them:
Confetti effect: initially, the confetti effect that appears when clicking the buttons was causing slow rendering according to the Lighthouse test, so we fixed it by having the script tag with the source of the library after the HTML, so now it loaded after everything else, speeding up the initial loading of the site.
Preloading images using a link tag at the top of the HTML also improved our Lighthouse test.
We used to have an error of too many requests happening to the server that would crash it for a bit, while the server catches up with the requests. This was happening because we would be updating the server every time the main button was pressed so someone clicking very very fast would be able to send a lot of requests at a time. This was fixed by only updating the server every second instead of every click, since you can click many times inside of one second. 
Used to have it when you bought an upgrade, the program would delete the button completely. But when restarting the game, it made it much less convenient to recreate the buttons. So we changed it to when an upgrade was bought, the button would be set to disabled and transparent. So to the user, it doesn’t exist, but when restarting, it was as simple as resetting them all to visible and enabled

Workload:
Patrick Hunter: Server - Set up endpoints for saving and loading game data for a user, as well as endpoints for securely authenticating users. The server is running with express-js, and uses passport and express-session to authenticate users and store session data, respectively. Game data and login information are both managed by MongoDB.
Szymon Mamro: Javascript - Implemented the javascript for each button on the game’s page, as well as implemented the timer, and progress bar, and created functions to retrieve information related to the current user from the server database to allow them to resume their game, as well as update the server with, the current game state to save in the database. Also added the win/loss conditions and restart of the game
Andres Negron: HTML - Made UI mockups for the site (including color palette and written instructions), then created it using HTML while trying to follow CRAP principles and tips for writing, designing, and developing websites. Implemented CSS styling for the site and added the confetti effect using Javascript. Ran the Lighthouse test during development to try to get the highest score we could. Wrote most of the Readme to explain the thoughts behind the CSS and tips/principles.

Accessibility features (including the link to the lighthouse test).
High contrast
Simple layout
Added names to important HTML tags for users that use a voice-over assistant.

TECHNICAL ACHIEVEMENTS
Deployed using Glitch and the server runs on express-js. User login is managed using MongoDB.
Used CSS to style our site:
Font Import: Uses Google Fonts to import 'Roboto' for a clean, modern look.
Global Style: Sets a flexbox layout for the entire page, with dim gray background and white text.
Login Box: Centrally positioned with flexible width and max-content height, styled with a white background and rounded borders.
Titles and Subtitles: Uses bold weights and text shadows for emphasis.
Flex Containers and Columns: Utilized for layout structure, with flex properties to align and distribute content evenly.
Interactive Elements (Buttons): Styling for circle buttons with hover effects and confetti trigger on click, using background images and dynamic positioning.
Tables and Listings: Specific styling for food and leaderboard tables to manage spacing, alignment, and scrolling.
Progress Bars: Visually represents time progression with color-coded bars.
Instruction Modal: A fixed pop-up box for game instructions, with a close button styled distinctly for visibility.
Animation: we used a confetti effect when clicking buttons and a progress bar indicating time.
Use multiple semantic HTML tags: 
Images: <img>
Tables: <table>, <tr>, <th>, and <td>
Header: <header>
Footer: <footer>
Paragraphs <p>
Scripts: <script>
Link (Stylesheets): <link>
We created a single-page app (plus the login) that allows users to submit data (after login in) and always shows the current state of the server-side data (leaderboard and current total Goatbucks). When the user submits data, the server responds by sending back the updated data.
In addition to a form enabling adding and deleting data on the server, also add the ability to modify existing data: in our case, the user can not directly modify their scores since it would defeat the purpose of getting a high score, instead, they have to earn a new high score for the leaderboard to change.
On the server, passport and express-session were used to properly authenticate and manage users using the site.
Lighthouse test: we tried our best to get high scores, for Performance, we couldn’t get text compression to work on the server side, hence the 99. And for Best practices, we were not getting the console errors that the test found, so we were not sure what was going on, so we continued testing and didn’t find the root cause.
https://pagespeed.web.dev/analysis/https-cs4241-group12-final-glitch-me-game-html/f75h3r166v?form_factor=desktop 
Performance 99
Accessibility 100
Best Practices 96
SEO 100

DESIGN ACHIEVEMENTS
Color palette:
Background: #696969
Text: #000000
Text in tables: #FFFFFF
Upgrades tables: #F08080
Progress bar background: #dddddd
Progress bar: #4caf50
Close button for instruction box: #FF0000
Palette screenshot: https://drive.google.com/file/d/1QGK7NSnacAWKM9P6b70mp6naDjrSYZqN/view?usp=sharing 
Tips for writing
Provide informative, unique page titles: Goatbucks Clicker.
Use headings to convey meaning and structure: Time, Leaderboard, Restaurant Names.
Make link text meaningful: not applicable.
Write meaningful text alternatives for images: the clicker is a goat, so it’s inferred with it you make Goatbucks, especially to a WPI user base. The instructions are thorough, and since we don’t have any images apart from the goat, the game should be easy to understand overall.
Create transcripts and captions for multimedia: applicable.
Provide clear instructions: the instructions are listed on the login page and during the game so the user can refer back to them at any time. They go through each aspect of the game: the clicker, time, high scores, and upgrades.
Keep content clear and concise: apart from the short instructions, there isn’t any more long-form text.
Tips for designing
Provide sufficient contrast between foreground and background: dark gray contrasts the white text, and on the tables, the light red contrasts the black text.
Don’t use color alone to convey information: even if the site was in black and white, everything would be just as easy to understand, if not the same, especially because all buttons are clearly different from regular text.
Ensure that interactive elements are easy to identify: the Goat button changes in color when hovered (indicating it’s clickable), and when clicked, it has a confetti effect to let the user know they are progressing in the game. The clicking affects the total Goatbucks, which is why it’s so bright, big, and a different color (green).
Ensure that form elements include clearly associated labels: on the login screen, the fields are labeled. On the upgrades table, all columns and rows are labeled. All other sections have descriptive headings.
Provide easily identifiable feedback: when losing, winning, or not having enough Goatbucks for an upgrade, you get a big sign telling you. When clicking the Goat button and buying upgrades, there’s a confetti effect. Buttons are slightly dim when hovered. The time bar is bright and green and it tells you what ‘year’ you’re in.
Use headings and spacing to group related content: we used this alongside enough margin/paddings to visually separate all sections: time, clicker, leaderboard, and restaurants.
Create designs for different viewport sizes: the leaderboard is scrollable when it has many users, the different sections’ margins reduce on narrower screens, and the restaurant tables section is scrollable to the sides on narrower screens.
Include image and media alternatives in your design: not applicable.
Provide controls for content that starts automatically: the player has to sign in to start the game and can pause a user’s session by logging out and picking up where they left off by logging back in.
Tips for development
Associate a label with every form control: on the login screen, the fields are labeled. On the upgrades table, all columns and rows are labeled. All other sections have descriptive headings.
Include alternative text for images: not applicable.
Identified page language on the HTML files.
Use mark-up to convey meaning and structure: since we don’t have long-form text, this wasn’t really applicable.
Help users avoid and correct mistakes: when trying to sign in with a user that doesn’t exist, it prompts you to create it instead. Apart from this, there really aren’t any mistakes to be made.
Reflected the reading order in the code order (top to bottom and left to right).
Write code that adapts to the user’s technology: again, the leaderboard is scrollable when it has many users, the different sections’ margins are reduced on narrower screens, and the restaurant tables section is scrollable to the sides in narrower screens.
Provide meaning for non-standard interactive elements: we added “name=””;” to HTML tags.
Buttons and login form are accessible using the tab and enter keys.
Avoid CAPTCHA where possible: not applicable.
CRAP principles
Contrast
Large text for headings and small text for body (time, clicker, leaderboard, and restaurant titles).
Color: the gray background contrasts the white text; on the tables, the light red contrasts the black text. The green and big font for the Goatbucks indicates that’s what’s most important.
Font: we want the focus to be the Goat button in the center (bright red, big), so we went with a subtle but modern font: Roboto.
Shape: we went with rounded edges for the restaurants because sharp edges looked out of place due to the prominence of the Goat button (a circle).
Emphasis: Goatbucks amount is big and a different color so the user is always focused on them. Table headers are bolder to make the overall table more digestible.
Repetition
Red and gray (WPI colors) are the main focus, so they repeat throughout the site. White and black are used for everything that doesn’t need that much attention. Time and Goatbucks are the main game mechanics, so they are green.
Alignment
Everything is centered with enough padding, allowing all buttons to be easily recognizable.
Proximity
The site is divided into two halves, the top and bottom. The top is then divided into three, with the Goat button at the center since it’s what the user will click the most, with the time and leaderboard to its sides.
The bottom half has all the upgrades, we made it so that the order in which the user will generally buy upgrades is from the top left to the bottom right (due to their prices).
The time and leaderboard don’t require any user interaction, so they are towards the top corners, allowing the buttons to be towards the middle and center of the screen., 


