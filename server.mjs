import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.mjs";
import "express-async-errors";
import errorHandler from "./middleware/errorHandler.mjs";
import { connectDB } from "./db/connect.mjs";
import { userRouter } from "./routes/user.mjs";
import { noteRouter } from "./routes/note.mjs";

// initialize app and port
const port = process.env.PORT;
const app = express();

// middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", noteRouter);

// custom middleware
app.use(errorHandler);

// server & DB setup
connectDB(process.env.MONGO_URI);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () =>
    console.log(`Server is running on http://localhost:${port}`)
  );
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});
