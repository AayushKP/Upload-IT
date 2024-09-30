const express = require("express");
const fileRoutes = require("./routes/file");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const { protect } = require("./middlewares/authMiddleware");
const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

connectDB();

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/file", fileRoutes);
app.use("/api/auth", authRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
