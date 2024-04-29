# Final Project- Sharpify

[https://cs4241-final-project-vsnm.onrender.com/](https://cs4241-final-project-vsnm.onrender.com/)

## Description

For our project, we developed an image sharpener – called Sharpify – that aimed to develop a system where users can sign in, upload new images to be enhanced, and access their saved images. This application will allow users to interactively sharpen images, providing a user-friendly interface and efficient processing. We used React.js, Bootstrap, and CSS to create the pages.

To enhance an image, we made a call to the Deep Image AI API (https://deep-image.ai/app/). This API has many tools and specific enhancement variables and parameters for the variables that had to be sent from our server. These enhancements include deblurring, color enhancement, light enhancement, and denoise. Some of them have their parameters like denoise. Denoise in the Deep Image AI API has two versions so we put in v2 as a parameter to specify the most recent version. Once we send an image, we receive the enhanced image URL that gets downloaded to the user's local machine and sent to the database through our server.

Our application uses MongoDB and Firebase to store our data. When a user registers to Sharpify, their data is stored in the user collection. Whenever a user uploads an image, the image is sent to Firebase, where the image will be stored, while the image URL created by Firebase is sent to MongoDB. In MongoDB, the image URLs are stored in their own collection with the uploaded users _ID as one of its fields. When accessing the saved images, the server retrieves the signed-in users _ID, and retrieves the image URLs stored in MongoDB that contain the user _ID.

**NOTE**: Our current API only has 30 calls left!

## How to Access Site
Our site can be accessed at this URL: [https://cs4241-final-project-vsnm.onrender.com/](https://cs4241-final-project-vsnm.onrender.com/).
For our hosting, we used Render, which means that if our site has been inactive, it may take a minute or two to open. To log into the site, a user can use the register page to create an account. To see saved images being persisted across uses, a user can return to log in and resign in to see their images being saved across uses. Our demo account is also available for users to see persistence across uses. This account is accessible using the email: “demo” and the password: “password”. This account has one uploaded image, but more can be uploaded.


## Example

![Before](https://github.com/dovushman/cs4241-final-project/blob/main/before.png)

![after](https://github.com/dovushman/cs4241-final-project/blob/main/sharpified-image%20.png)

## Technologies and Frameworks
- **Front-end**:
  - **React**: To build a dynamic and responsive UI.
  - **JavaScript**: For general front-end programming.
  - **React Bootstrap and Custom CSS**: For styling the application.

- **Back-end**:
  - **Firebase**: Store the images uploaded by users 
  - **Express**: For making API requests to our backend.
  - **MySQL**: To store user and image data securely.
  - **Node.js File System Module**: To interact with the file system for image uploads and downloads.
  - **MongoDB**: Store user data and the image URLs provided by Firebase 

- **Image Processing**:
  - **Deep Image API**: Call to this API from the server giving the image and enhancements to make on the image
  - **Canvas API**: To display graphics and results of the image processing.

## Challenges

**Project Scope and Time**
- We had planned to use Tensorflow and Potrace to create a model that can enhance and vectorize images however, we realized that creating and training the model would take way too long. We decided to switch to using an image-enhancing API.

**Storing Images**
- Initially, we planned to use MongoDB to store the images, but we quickly realized that Mongo was not meant to store images. We decided to use Firebase since they were a service we could use for free that matched what we were looking for. From here, setting up Firebase took a bit of work since we never used it before, and there were multiple files we needed to create to have Firebase work outside of adding it to our code.

**Image display**
- Getting an image of any aspect ratio to display correctly in both the saved images pages and the dashboard modal was quite the challenge. This was especially tricky due to the saved images page using a bootstrap column system, and the modal being split into a left and right side. We were able to solve this problem using clever containering and custom CSS properties, though it took us an extensive amount of time to figure this out.


## Team Roles

- **Dov Ushman** - Lead Cloud Engineer: Responsible for interfacing with the server and managing our database operations. 
- **Andrew Nguyen** - Machine Learning Expert: Implemented the Canvas API and Deep Image AI API to enhance and display images 
- **Luke Foley** - Lead Front-End Developer: Focused on building the front-end architecture using React.js and ensuring a seamless user experience.


## Accessbility

We really wanted to make sure our app was accessible to users, so we tried to keep our pages streamlined and easy to use. We kept track of accessibility using Lighthouse to ensure our website would be usable for everyone. Our final website has an accessibility score of 100% on our home page. Specific examples of ways we focused on accessibility were by ensuring we had a strong color contrast so all parts of the page would be readable and ensuring all of our buttons had text on them so their purpose would be clear.

![LightHouse Scores](https://github.com/dovushman/cs4241-final-project/blob/main/lighthouse_scores.png)
