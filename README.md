# Odin Blog REST API

**:point_right: See it live [here]()**

Odin Blog Api is the backend portion of the blog project that is part of the Odin Node Course. The intention is to create an API for my blog site that I will be able to use 2 different front ends to access with different functionality for both (one to read the blogs like an everyday vistory and the other to post, edit, delete and other blog management functions). Anyone visiting the first site will be able to read all the blogs and comments for each post but users will have to sign up in order to write comments for the post. The second site will have a built-in admin user that can create, edit, publish, unpublish and delete posts and can also edit or delete comments.

I created this project mainly to practice full-stack development with a focus on authentication, JSON Web Tokens, and connecting different front ends to a backend api.

## Features

- CRUD operations on Blog posts.
- Create, Read, and Delete on public comments on those posts.
- User authentication with passport and jwt.
- Securing passwords using bcryptjs.
- Schema validation using Mongoose.
- Uses Swagger for API documentation.


### Prerequisites

- You'll need a running MongoDB instance, either locally or deployed in the cloud. You can deploy one easily following this [documentation](https://www.mongodb.com/docs/atlas/getting-started/).
- Nodejs version `20.9.0` or above.

### Cloning the repository

```bash
# Clone this repository
$ git clone https://github.com/XanDev3/odin-blog-api.git

# Go into the repository
$ cd odin-blog-api
```

### Getting the project ready

From `odin-blog-api` directory run the following commands.

```bash
# Install dependencies
$ npm install
```

### Setting up environment variables

- Create a `.env` located in server similar to `.env.example` with the following environment variables:
  - `PORT`: Your node server will run on this port. Default is 3000. If you want to use a different port, make sure to update it in client's `axios.baseUrl`.
  - `NODE_ENV`: Default is `development`.
  - `MONGODB_URI`: Update the placeholders with your running MongoDB instance's data.
  - `JWT_SECRET`: Secret to sign and validate jwt tokens passed to clients.
  - `ADMIN_USERNAME`: The username for built-in user to enter to have management abilities for the blog.
  - `ADMIN_PASSWORD`: The password for the built-in user.
- Update the environment variables and save the file.

### Starting the application

From `odin-blog-api` directory, run the following commands:
```bash

# Start the client - dev is a script located in package.json that will use concurrently to run (in parallel) nodemon and tailwindcss
$ npm run dev
```
Once the application is running, you can verify that it is running correctly by opening your web browser and navigating to `http://localhost:3000/` or `http://localhost:<PORT#>` (where <PORT#> is the number specified in your .env). You should see the Express welcome page. You can also navigate to `http://localhost:3000/api-docs` to view the swagger documentation and `http://localhost:3000/api` should redirect here too.

### Swagger Documentation

This project now includes Swagger documentation to make it easier to understand and interact with the API.

- **What is Swagger?**
  Swagger is a tool that helps you design, build, document, and consume REST APIs. With our Swagger UI, you can explore all the available API endpoints, understand their requirements, and test them directly from your browser.

- **Accessing Swagger UI:**
  1. Ensure you can navigate to `http://localhost:<PORT#>` (where <PORT#> is the number specified in your .env) and see "Welcome to Express" page.
  2. Once the application is running, open your web browser and navigate to `http://localhost:<PORT#>/api-docs`.

- **Testing Routes:**
  In the Swagger UI, you will see a list of all available API endpoints. You can expand each endpoint to see its details, such as:
    - The HTTP method (GET, POST, PUT, DELETE).
    - The required parameters (if any).
    - The expected request body (for POST and PUT requests).
    - The possible response codes and their meanings.
  You can try out any of these endpoints directly in the Swagger UI by clicking the "Try it out" button and then "Execute". If at any point you get a { "message": "Not allowed by CORS" } response. Make sure to update `config/allowedOrigins.js` to include your dev server url i.e. `http://localhost:3000` or `https://my-server-api.dev`.

- **Accessing Protected Routes:**
  Many routes in this API are protected and require a valid JWT (JSON Web Token) to access them. Here's how to obtain and use a token:

1.  **Signup a New User:**
    -   Expand the `/api/signup` route.
    -   Click "Try it out."
    -   Enter a desired username and password in the appropriate fields.
    -   Click "Execute".
    -   If successful, the response body will contain a `Signup Successful` message property, a 'user' property and  `token` property with your JWT.
    -   Copy that token and skip to #3. Authroize Swagger UI
2.  **Login an Existing User (optional):**
    - If you have already signed up you can use the `/api/login` route to obtain a new token.
    -   Expand the `/api/login` route.
    -   Click "Try it out."
    -   Enter the desired username and password in the appropriate fields.
    -   Click "Execute".
    -   If successful, the response body will contain a `token` property with your JWT.
3.  **Authorize Swagger UI:**
    -   In the top right corner of the Swagger UI, click the "Authorize" button.
    -   Find the "jwtAuth" security scheme.
    -   In the "Value" field, paste the **entire** JWT that was returned from the `/api/signup` or `/api/login` step. Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1ZGY5ZmM3YjY5YmFjZDJkNTNhYzk0MiIsInVzZXJuYW1lIjoidGVzdCIsImlzQWRtaW4iOmZhbHNlfSwiaWF0IjoxNzExODc5NjY5LCJleHAiOjE3MTE5NjYwNjl9.1w_O_jQ8m_6tKzW_Qp97i12kX5f5yvY_5T3XQ5g9Uuc`
    -   Click "Authorize".
    -   Click "Close".
4.  **Test Protected Routes:**
    -   Now you can test any protected user route (see Admin Protected Routes for more info).
    -   Expand the route you want to test.
    -   Click the "Try it out" button.
    -   Fill out any required fields.
    -   Click "Execute".
    -   The token will be automatically included in the request headers.
    -   A successful response (e.g., a 201 status for creating a post) means that the protected route was accessed correctly.
5.  **Admin Protected Routes:**
    -   Some routes are meant to be used by Admin users only.
    -   Signup will not grant `isAdmin` to the user created and this api has no functionality to create admins. This is intentional;In order to protect these operations from anyone without DB access to change the content of the live site.
    -   If you would like to create an Admin user you will have to manually create one in your MongoDB instance. Or alternatively add the functionality to create Admins in your application however you see fit.  

## Data Diagram
![Diagram](/public/images/DBdiagram.png)

## Technologies Used
- [Nodejs](https://nodejs.org/)
- [Expressjs](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoosejs](https://mongoosejs.com/)
- [Swagger](https://swagger.io/)

## License

<a href="https://github.com/xandev3/odin-members-only/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License">
</a>
