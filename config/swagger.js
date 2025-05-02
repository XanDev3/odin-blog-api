const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Blogging-API",
        version: "1.0.0",
    },
    servers: [
        {
            url: "/api",
        },
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
                required: ["title", "text"],
                properties: {
                    title: {
                        type: "string",
                        description: "The title of the post.",
                    },
                    text: {
                        type: "string",
                        description: "The text content of the post",
                    },
                    user: {
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
                },
                example: {
                    title: "Example Post",
                    text: "This is an example blog post.",
                    user: {
                        id: "65dfb8a847a155d99e1a9498",
                        username: "testuser",
                        isAdmin: false
                    },
                    timestamp: "2024-03-01T12:00:00Z",
                },
            },
            Comment: {
                type: "object",
                required: ["text"],
                properties: {
                    text: {
                        type: "string",
                        description: "The text content of the comment",
                    },
                    user: {
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
                    text: "This is an example comment.",
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
                },
            },
        },
        "/signup": {
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
        "/login": {
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
                    },
                    400: {
                        description: "Login Failed",
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

export default swaggerSpec;