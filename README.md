# Odin Blog REST API

**:point_right: See it live at my frontend repo [here](https://github.com/XanDev3/odin-blog-read-client)**

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
  - `JWT_SECRET`: Secret to sign and validate jwt tokens passed to clients. Basically like a password, it should be many characters, hard to guess and never shared or uploaded to github.
  - `ADMIN_USERNAME`: The username for built-in user to enter to have management abilities for the blog.
  - `ADMIN_PASSWORD`: The password for the built-in user.
- Update the environment variables and save the file.

### Starting the application

From `odin-blog-api` directory, run the following commands:
```bash

# Start the client - dev is a script located in package.json that will use concurrently to run (in parallel) nodemon and tailwindcss
$ npm run dev
```
Once the application is running, you can verify that it is running correctly by opening your web browser and navigating to `http://localhost:3000/`. You should see a JSON response of `{ message: '/api' }`. You can also navigate to `http://localhost:3000/api-docs` to view the swagger documentation.

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
  You can try out any of these endpoints directly in the Swagger UI by clicking the "Try it out" button and then "Execute".

- **Accessing Protected Routes:**
  Many routes in this API are protected and require a valid JWT (JSON Web Token) to access them. Here's how to obtain and use a token:
<!-- Needs corrections     
    1. **Obtain a Token:** Use the `/auth/register` or `/auth/login` endpoints in the Swagger UI to create a new user or log in as an existing one. These endpoints will return a JWT in the response.
    2. **Authorize Swagger UI:** Click the "Authorize" button in the top right corner of the Swagger UI. Paste the obtained JWT (without the quotes) into the "Value" field and click "Authorize".
    3. **Test Protected Routes:** Now, you can test any protected route by expanding it and clicking "Try it out" and then "Execute". For example you could try testing the `/api/posts` route. The token will be automatically included in the request headers. -->


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
