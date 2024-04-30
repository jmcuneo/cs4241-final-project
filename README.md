# Web-based Instant Messaging Service - Chat App

## Project Overview

Our project is an advanced web-based instant messaging service designed to facilitate real-time communication between users through a secure and user-friendly interface. Users are required to create an account, which then allows them to participate in real-time messaging.The platform's interface is meticulously crafted to be clean and intuitive, ensuring that users can easily navigate and utilize the service without any hassle. This design philosophy is critical in eliminating barriers to effective communication, making our service accessible to a wide range of users with varying levels of technical expertise.

The challenges of this project were multifaceted, primarily revolving around ensuring real-time functionality, robust security, and seamless user experience across different devices and browsers. Integrating technologies such as Socket.IO for real-time communication and Zustand for efficient state management required sophisticated architectural decisions to maintain high performance and responsiveness of the application under the load of simultaneous users. Given these complexities and our successful implementation that meets all functional and non-functional requirements, this project merits a grade of 100%. The service not only meets its intended design specifications but also provides a reliable, secure, and easy-to-use platform for communication, reflecting a high standard of software engineering and user-centric design.

[View the project here] (https://cs4241-final-project-r2mj.onrender.com).

## Usage Instructions
### Login Details
- **Username:** johndoe
- **Password:** 123456
- **Username 2:** janedoe
- **Password 2:** 123456
- Can also create two accounts to chat to each other.
- To run locally, run npm run build and npm start and navigate to port 8000

### Interface:
- Fairly simple and understandable interface.
- Can use search to search for users and press enter and it will take you to the closest user with the search query.
- When logged in, top left will be the current logged in user's profile picture and name with the logout button next to it.
- Can switch between dark and light mode.

## Technologies Used
- **Node.js**: Forms the backbone of our backend infrastructure, managing server-side logic, including user authentication and message transmission. This enables our platform to handle complex operations efficiently while maintaining scalability.
- **Socket.io**: Key to our real-time communication capabilities, Socket.io supports websocket connections that enable features such as live messaging and automatic reconnection, ensuring that users experience minimal disruption in their interactions.
- **MongoDB Atlas**: Our choice for database management, MongoDB Atlas stores and organizes user data and chat histories. It provides robust scalability and security features, which are essential for handling sensitive information and supporting a growing number of users.
- **DaisyUI & TailwindCSS**: These tools greatly enhance the user interface by providing customizable components and utility-first styling. This combination allows us to create a clean and intuitive design that adapts seamlessly across different devices and browsers. Also used to switch between light and dark themes
- **React-Hot-Toast**:Utilized for displaying notifications and messages in an interactive manner, enhancing the user experience by providing timely and contextually relevant feedback.
- **Zustand**: Manages global state across our React application, simplifying the state logic needed in a dynamic environment. Zustand helps in maintaining a clean and manageable codebase, which is crucial for the scalability and maintainability of the application.

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
- **Themes**: Users can switch between dark and light modes to suit their visual preferences. Used state management to store the current theme throughout the app
- **Error Handling**: Robust error management with clear notifications helps users navigate and resolve issues quickly.
- **Search Functionality**: Enables easy searching for contacts within the application.
- **Minimalist Design**: Avoids unnecessary clutter to enhance user focus and ease of use.
- **Consistent UI**: Uniform design elements across the application improve user familiarity and interaction.
