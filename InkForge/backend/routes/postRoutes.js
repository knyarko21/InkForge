
const express = require("express");

const protect =
  require("../middleware/authMiddleware");

const optionalAuth =
  require("../middleware/optionalAuthMiddleware");

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require("../controllers/postController");

const router =
  express.Router();

router.get(
  "/",
  getAllPosts
);

router.get(
  "/:id",
  optionalAuth,
  getPostById
);

router.post(
  "/",
  protect,
  createPost
);

router.put(
  "/:id",
  protect,
  updatePost
);

router.delete(
  "/:id",
  protect,
  deletePost
);

module.exports = router;