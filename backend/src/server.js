import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use(express.json());

//Auth Route
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

//Auth API
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

//Deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
  connectDB();
});
