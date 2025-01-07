import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";

import loginRoutes from "./routes/login.route.js";
//import usersRoutes from "./routes/users.route.js";
//import songRoutes from "./routes/song.route.js";
// import albumsRoutes from "./routes/albums.route.js";
//import statsRoutes from "./routes/stats.route.js";
// import playlistRoutes from "./routes/playlist.route.js";

dotenv.config();

const app = express();

app.use(express.json()); 

console.log(process.env.MONGO_URI)

app.use("/api/v1/auth",loginRoutes)
// app.use("/api/v1/users",usersRoutes)
// app.use("/api/v1/song",songRoutes)
// app.use("/api/v1/albums",albumsRoutes)
// app.use("/api/v1/stats",statsRoutes)
// app.use("/api/v1/playlist",playlistRoutes)

app.listen(8000, () => {
  connectDB();
  console.log("Sever started at http://localhost:8000");
})

