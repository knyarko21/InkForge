
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/db");

// Load models and associations
require("./models");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// Static media
// ===============================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// Database
// ===============================

const databaseReady = sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    console.log("Database synchronized successfully");
  })
  .catch((error) => {
    console.error(
      "Database initialization failed:",
      error.message
    );

    throw error;
  });

// Wait for the database before processing requests
app.use(async (req, res, next) => {
  try {
    await databaseReady;
    next();
  } catch (error) {
    res.status(503).json({
      message: "Database is temporarily unavailable"
    });
  }
});

// ===============================
// Routes
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to InkForge API"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);

// ===============================
// Start server locally
// ===============================

if (require.main === module) {
  databaseReady
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `InkForge server running on port ${PORT}`
        );
      });
    })
    .catch(() => {
      process.exit(1);
    });
}

// ===============================
// Export app for Vercel
// ===============================

module.exports = app;