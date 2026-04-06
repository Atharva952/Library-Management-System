import express from "express";
import cors from "cors";
import "./config.js";
import mongoose from "mongoose";
import userRouter from "./router/user.router.js";
import bookRouter from "./router/book.router.js";
import authorRouter from "./router/author.router.js";
import { seedLibraryData } from "./seed/library.seed.js";

const app = express();
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

const port = process.env.PORT;
const db = process.env.DB_CONNECTION;
const dbName = process.env.DB_NAME || "atlast";

mongoose
  .connect(db, { dbName })
  .then(async () => {
    console.log(`database is connected to the server (${dbName})`);
    await seedLibraryData();
  })
  .catch((err) => {
    console.error(err);
  });

app.use("/api/v1/user", userRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/author", authorRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
