
const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const sequelize = require("./config/db");

// Load models and associations
require("./models");

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
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ===============================
// Routes
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to InkForge API"
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

// Comment routes
app.use(
  "/api",
  commentRoutes
);

// ===============================
// Database & Server
// ===============================

sequelize
  .sync()
  .then(() => {
    console.log(
      "Database synchronized successfully"
    );

    app.listen(PORT, () => {
      console.log(
        `InkForge server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Unable to synchronize database:",
      error.message
    );
  });