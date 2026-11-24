
const express = require("express");

const protect = require("../middleware/authMiddleware");

const User = require("../models/User");
const Post = require("../models/Post");

const router = express.Router();

// ===============================
// Get Current User
// ===============================

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    user: req.user
  });
});

// ===============================
// Get Current User's Posts
// ===============================

router.get("/me/posts", protect, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        userId: req.user.id
      },

      include: {
        model: User,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "username"
        ]
      },

      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error(
      "Get current user posts error:",
      error
    );

    res.status(500).json({
      message:
        "Something went wrong while fetching your posts"
    });
  }
});

module.exports = router;