import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

//Auth Route
import authRoutes from './routes/auth.route.js';

//Auth API
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
