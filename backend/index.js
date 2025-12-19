import express from "express";
import authRoutes from "./routes/auth.routes.js"
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT , ()=> {
    console.log("server started", process.env.PORT );
})
