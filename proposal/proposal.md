# Sharpify Project Proposal

**Team Members:**
- Luke Foley
- Dov Ushman
- Andrew Nguyen

**Instructor:**
- Professor Cuneo

**Date:**
- April 16th, 2024

**Course:**
- Webware

## Project Overview

For our project, we plan on creating an image sharpener and vectorizer. We aim to develop a system where users can sign in, upload new images to be enhanced, and access their saved images. This application will allow users to interactively sharpen and vectorize images, providing a user-friendly interface and efficient processing.

## Team Roles

- **Dov Ushman** - Lead Cloud Engineer: Responsible for interfacing with AWS Lambda and managing our database operations.
- **Andrew Nguyen** - Machine Learning Expert: Tasked with implementing and fine-tuning the algorithms for image sharpening and vectorization.
- **Luke Foley** - Lead Front-End Developer: Focuses on building the front-end architecture using React and ensuring a seamless user experience.

## Technologies and Libraries

- **Front-end**:
  - **React**: To build a dynamic and responsive UI.
  - **JavaScript**: For general front-end programming.
  - **React Bootstrap and Custom CSS**: For styling the application.
  - **AWS Amplify Studio**: To leverage AWS services more seamlessly within the application.

- **Back-end**:
  - **AWS Lambda**: To handle serverless computing, making the backend scalable and cost-effective.
  - **Axios**: For making API requests to our backend.
  - **MySQL**: To store user and image data securely.
  - **Node.js File System Module**: To interact with the file system for image uploads and downloads.

- **Image Processing**:
  - **TensorFlow.js**: To perform image sharpening directly in the browser.
  - **Potrace**: Used for converting raster images to vector formats.
  - **Canvas API**: To display graphics and results of the image processing.