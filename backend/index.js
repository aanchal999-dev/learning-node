import express from "express";
import authRoutes from "./routes/auth.routes.js"
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

app.listen(8000, ()=> {
    console.log("server started");
})
