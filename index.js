import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";

import loginRoutes from "./routes/login.route.js";

dotenv.config();

const app = express();

app.use(express.json()); 

console.log(process.env.MONGO_URI)

app.use("/api/v1/auth",loginRoutes)

app.listen(8000, () => {
  // connectDB();
  console.log("Sever started at http://localhost:8000");
})

