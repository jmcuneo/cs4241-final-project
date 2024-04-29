# Web-based Instant Messaging Service - Chat App

## Project Overview
Our project is centered around creating a web-based instant messaging service that allows for real-time communication between users. This service requires users to create an account to engage in both encrypted and unencrypted messaging. We focused on delivering a clean, intuitive interface to ensure a seamless user experience. This project is particularly aimed at providing a reliable platform for secure communication. [View the project here] (https://cs4241-final-project-r2mj.onrender.com).

## Usage Instructions
### Login Details
- **Username:** John Doe
- **Password:** 123456
- **Username 2:** Jane Doe
- **Password 2:** 123456
- Can also create two accounts to chat to each other.

### Interface:
- Fairly simple and understandable interface.
- Can use search to search for users and press enter and it will take you to the closest user with the search query.
- When logged in, top left will be the current logged in user's profile picture and name with the logout button next to it.
- Can switch between dark and light mode.

## Technologies Used
- **Node.js**: Managed backend infrastructure, handling server-side logic including user authentication and message transmission.
- **Socket.io**: Facilitated websocket connections for real-time communication, supporting features like automatic reconnection.
- **MongoDB Atlas**: Stored and organized user data such as profiles and chat histories, providing scalability and security.
- **DaisyUI & TailwindCSS**: Enhanced the UI with customizable components and utility-first styling and 
- **React-Hot-Toast**: Used to displaying notifications and messages interactively.
- **Zustand**: Managed global state across the React application, simplifying state logic in dynamic environments.

## Project Challenges
- **Design Consistency**: Achieving a consistent and responsive design across various devices using TailwindCSS and DaisyUI was challenging, particularly when integrating various components for a dynamic content setup.
- **State Management**: Managing a frequently changing global state with Zustand, necessary for updating user statuses and new messages without performance issues.
- **Session Persistence**: Implementing mechanisms to remember user sessions to local storage across tabs without requiring re-login.
- **Socket.io Integration**: Coordinating real-time updates through Socket.io with Zustand state management.

## Contributions
- **Eamon**: Focused on the authentication processes and socket implementation.
- **Hanzalah and Rohit**: Handled all backend developments and database schema.
- **Everyone**: Contributed to frontend development and interface design.

## Accessibility Features
- **Themes**: Users can switch between dark and light modes to suit their visual preferences.
- **Error Handling**: Robust error management with clear notifications helps users navigate and resolve issues quickly.
- **Search Functionality**: Enables easy searching for contacts within the application.
- **Minimalist Design**: Avoids unnecessary clutter to enhance user focus and ease of use.
- **Consistent UI**: Uniform design elements across the application improve user familiarity and interaction.

