import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import streamRoutes from "./routes/stream.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;  
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

// Enhanced CORS configuration for development
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://68a94c86902af1567973a7bc--linkupfrontend.netlify.app",
      "https://68b56d67b03f1c43e846a422--linkupchatapp.netlify.app",
      "https://satyam-singh1.github.io"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200 // For legacy browser support
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/stream", streamRoutes);

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
