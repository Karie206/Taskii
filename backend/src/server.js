import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import taskRoute from "./routes/tasksRoutes.js";
import dns from "dns";
import connectDB from "./config/db.js";
import cors from 'cors';

const PORT = process.env.PORT || 5000;
const app = express();

dns.setServers(['8.8.8.8', '8.8.4.4']);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Taskii API is running!" });
});

app.use("/api/tasks", taskRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}!!!`);
    });
}).catch((err) => {
    console.error("Error connecting to DB: ", err.message);
    process.exit(1);
});