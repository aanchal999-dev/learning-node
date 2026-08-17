import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server started", process.env.PORT);
  });
});
