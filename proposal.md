# Final Project Proposal - Instant Messaging Service - Group 9

Team members: Éamonn Prendergast, Hanzalah Qamar, Rohit Tallapragada

## General Description

Our project is focused on developing a web-based instant messaging service to facilitate real-time communication among users. The service will be account based, and users will have to create an account in order to message other users. Users will be able to open up end to end encrypted message channels in addition to their regular unencrypted chats. Emphasis will be placed on a clean, intuitive interface that is accessible and easy to navigate, promoting a seamless user experience.

## Technologies 

The user interface will be built using react so we can more easily change the appearance of the client. Backend: We will utilize Node.js for the backend infrastructure, which will handle all server-side logic including user authentication and real-time data transmission. We will use Material UI to create a visually appealing design for the application

We will use socket.IO to manage websocket connections for realtime client-server communication, which is crucial for sending and receiving messages instantly. We will use MongoDB to store user data, chat history, and other necessary data, given its scalability and ease of integration with Node.js.

In order to manage the end-to-end encryption, we will use the SubtleCrypto interface in order to generate asymmetric keys to open up a channel between two clients, and use symmetric encryption once a channel has been opened,


