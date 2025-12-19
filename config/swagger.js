const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Blogging-API",
        version: "1.0.0",
    },
    servers: [
        {
            url: "/",
            description: "Development/Testing server, will use localhost:<PORT>"
        },
        {
            url: "https://odin-blog-api-coral.vercel.app/",
            description: "Live Site URL"
        }
    ],
    components: {
        schemas: {
            Signup: {
                type: "object",
                properties: {
                    username: {
                        type: "string",
                        description: "The username of the user",
                    },
                    password: {
                        type: "string",
                        format: "password",
                        description: "The password of the user",
                    },
                },
                required: ["username", "password"],
            },
            Login: {
                type: "object",
                properties: {
                    username: {
                        type: "string",
                        description: "The username of the user",
                    },
                    password: {
                        type: "string",
                        format: "password",
                        description: "The password of the user",
                    },
                },
                required: ["username", "password"],
            },
            Error: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "A description of the error",
                    },
                },
                example: {
                    message: "An error has occurred",
                },
            },
            Post: {
                type: "object",
                required: ["title", "content", "isPublished"],
                properties: {
                    title: {
                        type: "string",
                        description: "The title of the post.",
                    },
                    content: {
                        type: "string",
                        description: "The text content of the post",
                    },
                    author: {
                        type: "object",
                       properties: {
                           id: { type: "string" },
                           username: { type: "string" },
                           isAdmin: { type: "boolean" },
                       },
                       description: "the user who created the post",
                    },
                    timestamp: {
                        type: "string",
                        format: "date-time",
                        description: "The timestamp of the post creation",
                    },
                    isPublished:{type: "boolean", description: "if the post is published"}
                },
                example: {
                    title: "Example Post",
                    content: "This is an example blog post.",
                    isPublished: true,
                    timestamp: "2024-03-01T12:00:00Z",
                },
            },
            Comment: {
                type: "object",
                required: ["text"],
               properties: {
                    content: {
                        type: "string",
                        description: "The content of the comment",
                    },
                    author: {
                         type: "object",
                        properties: {
                            id: { type: "string" },
                            username: { type: "string" },
                            isAdmin: { type: "boolean" },
                        },
                        description: "the user who created the comment",
                    },
                    post: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                        },
                        description: "the post this comment belongs to",
                    },
                    timestamp: {
                        type: "string",
                        format: "date-time",
                        description: "The timestamp of the comment creation",
                    },
                },
                example: {
                    content: "This is an example comment.",
                     user: {
                        id: "65dfb8a847a155d99e1a9498",
                        username: "testuser",
                        isAdmin: false
                    },
                    post: {
                        id: "65dfb8a847a155d99e1a9499",
                    },
                    timestamp: "2024-03-01T12:00:00Z",
                },
            },
        },
        securitySchemes: {
            jwtAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },

    paths: {
        "/api/": {
            get: {
                summary: "Returns a message that describes the /api endpoint",
                tags: ["Home"],
                responses: {
                    200: {
                        description: "Returns a message",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {
                                        message: "/api",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/posts": {
            get: {
                summary: "Get all blog posts",
                tags: ["Posts"],
                responses: {
                    200: {
                        description: "Returns all blog posts",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Post",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/posts/{postid}": {
            get: {
                summary: "Get a blog post by ID",
                tags: ["Posts"],
                parameters: [
                    {
                        in: "path",
                        name: "postid",
                        required: true,
                        description: "ID of the blog post",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "Returns the blog post",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Post",
                                },
                            },
                        },
                    },
                    404: {
                        description: "Post not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
            put: {
                summary: "Update a blog post (protected - Admin only)",
                tags: ["Posts"],
                security: [
                    {
                        jwtAuth: [],
                    },
                ],
                parameters: [
                    {
                        in: "path",
                        name: "postid",
                        required: true,
                        description: "ID of the blog post",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type:"object",
                                properties:{
                                    title:{type: "string"}, content:{type:"string"}
                                },
                                $ref: "#/components/schemas/Post",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Blog post updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Post",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    404: {
                        description: "Post not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                summary: "Delete a blog post (protected - Admin only)",
                tags: ["Posts"],
                security: [
                    {
                        jwtAuth: [],
                    },
                ],
                parameters: [
                    {
                        in: "path",
                        name: "postid",
                        required: true,
                        description: "ID of the blog post",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "Blog post deleted successfully",
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    404: {
                        description: "Post not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/posts/": {
            post: {
                summary: "Create a new blog post (protected - Admin only)",
                tags: ["Posts"],
                security: [
                    {
                        jwtAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Post",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Blog post created successfully",
                      content:{
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {message:"Successfully created Post"}
                                }
                            }
                        }
                      },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/posts/{postid}/comments": {
            post: {
                summary: "Create a new comment on a post (protected - User)",
                tags: ["Comments"],
                security: [
                    {
                        jwtAuth: [],
                    },
                ],
                parameters: [
                    {
                        in: "path",
                        name: "postid",
                        required: true,
                        description: "ID of the blog post",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                          "application/json": {
                            schema: {
                                type:"object",
                                properties:{
                                    title:{type: "string"}, content:{type:"string"}, isPublished:{type: "boolean"}
                                }
                            }
                        },
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Comment",
                            },
                            example:{
                                content: "this is an example comment"
                            }
                        },
                    },
                     "application/x-www-form-urlencoded": {
                        schema: {
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Comment created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Comment",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/posts/{postid}/comments/{commentid}": {
            get: {
                summary: "Get a comment by ID",
                tags: ["Comments"],
                parameters: [
                    {
                        in: "path",
                        name: "postid",
                        required: true,
                        description: "ID of the blog post",
                        schema: {
                            type: "string",
                        },
                    },
                    {
                        in: "path",
                        name: "commentid",
                        required: true,
                        description: "ID of the comment",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "Returns the comment",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Comment",
                                },
                            },
                        },
                    },
                    404: {
                        description: "Comment not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
            put: {
                summary: "Update a comment (protected - Admin only)",
                tags: ["Comments"],
                security: [
                    {
                        jwtAuth: [],
                    },
                ],
                parameters: [
                    {
                        in: "path",
                        name: "postid",
                        required: true,
                        description: "ID of the blog post",
                        schema: {
                            type: "string",
                        },
                    },
                    {
                        in: "path",
                        name: "commentid",
                        required: true,
                        description: "ID of the comment",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Comment",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Comment updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Comment",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    404: {
                        description: "Post or Comment not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                summary: "Delete a comment (protected - Admin only)",
                tags: ["Comments"],
                security: [
                    {
                        jwtAuth: [],
                    },
                ],
                parameters: [
                    {
                        in: "path",
                        name: "postid",
                        required: true,
                        description: "ID of the blog post",
                        schema: {
                            type: "string",
                        },
                    },
                    {
                        in: "path",
                        name: "commentid",
                        required: true,
                        description: "ID of the comment",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "Comment deleted successfully",
                    },
                    401: {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    404: {
                        description: "Post or Comment not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/signup": {
            post: {
                summary: "User Signup",
                description: "Creates a new user account.",
                tags: ["Authentication"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Signup",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Signup Successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string",
                                        },
                                        id: {
                                            type: "string",
                                        },
                                        user: {
                                            type: "string",
                                        },
                                        token: {
                                            type: "string",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    403: {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        errors: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/login": {
            post: {
                summary: "User Login",
                description: "Logs in an existing user.",
                tags: ["Authentication"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Login",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Login Successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string",
                                        },
                                        id: {
                                            type: "string",
                                        },
                                        user: {
                                            type: "string",
                                        },
                                        token: {
                                            type: "string",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Login Failed",
                    },
                },
            },
        },
          "/api/logout": {
            post: {
                summary: "Logout a User",
                tags: ["Authentication"],
                responses: {
                    200: {
                        description: "Logout Successful",
                    },
                },
            },
        
        },
    },

    tags: [
        { name: "Home", description: "Home related routes" },
        { name: "Posts", description: "API endpoints related to blog posts" },
        {
            name: "Comments",
            description: "API endpoints related to comments on blog posts",
        },
        {
            name: "Authentication",
            description: "API Endpoints for Authentication",
        },
    ],


};

module.exports = swaggerSpec;