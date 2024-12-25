const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  credentials: true, // Allow cookies or Authorization headers
};

app.use(cors(corsOptions)); // Enable CORS with the specified options
app.use(express.json()); // Parse JSON requests

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;
