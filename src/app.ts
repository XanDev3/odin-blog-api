import "dotenv/config";
import express, { ErrorRequestHandler } from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import expressLayouts from "express-ejs-layouts";
import swaggerUi from "swagger-ui-express";
import corsOptions from "./config/corsOptions.js";
import swaggerSpec from "./config/swagger.js";
import { configurePassport } from "./config/passport.js";
import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup mongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to database");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
connectDB();

const app = express();

// Configure passport strategies - must be before passport.initialize()
configurePassport();
app.use(passport.initialize());

// view engine setup
app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/v1", apiRouter);

// Swagger/OpenAPI
app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// error handler
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res
    .status(err.status || 500)
    .setHeader("Content-Type", "application/json")
    .json({ code: err.status, message: err.message });
};
app.use(errorHandler);

export default app;
