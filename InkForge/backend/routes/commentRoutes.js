
const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createComment,
  getCommentsByPost,
  deleteComment
} = require("../controllers/commentController");

const router = express.Router();

// =====================================
// Get all comments for a post
// GET /api/posts/:postId/comments
// =====================================

router.get(
  "/posts/:postId/comments",
  getCommentsByPost
);

// =====================================
// Create a comment
// POST /api/posts/:postId/comments
// =====================================

router.post(
  "/posts/:postId/comments",
  protect,
  createComment
);

// =====================================
// Delete a comment
// DELETE /api/comments/:id
// =====================================

router.delete(
  "/comments/:id",
  protect,
  deleteComment
);

module.exports = router;