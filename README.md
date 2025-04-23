# Odin Blog REST API

![Screenshot](./.jpg)



**:point_right: See it live [here]()**

Odin Blog Api is the backend portion of the blog project that is part of the Odin Node Course. The intention is to create an API for my blog site that I will be able to use 2 different front ends to access with different functionality for both (one to read the blogs like an everyday vistory and the other to post, edit, delete and other blog management functions). Anyone visiting the first site will be able to read all the blogs and comments for each post but users will have to sign up in order to write comments for the post. The second site will have a built-in user that can create, edit, publish, unpublish and delete posts and can also edit or delete comments.

I created this project mainly to practice full-stack development with a focus on authentication, JSON Web Tokens, and connecting different front ends to a backend api.

## Features

- CRUD operations on Blog posts.
- Create, Read, and Delete on public comments on those posts.
- User authentication with passport and jwt.
- Securing passwords using bcryptjs.
- Schema validation using Mongoose.


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

- Populate `.env` located in server with the following environment variables:
  - `PORT`: Your node server will run on this port. Default is 3000. If you want to use a different port, make sure to update it in client's `.env` file.
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

## Technologies Used

- [Nodejs](https://nodejs.org/)
- [Expressjs](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoosejs](https://mongoosejs.com/)

## License

<a href="https://github.com/xandev3/odin-members-only/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License">
</a>
