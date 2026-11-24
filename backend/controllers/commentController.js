
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const {
  createCommentSchema
} = require("../schemas/commentSchema");

// ===============================
// Create Comment
// ===============================

const createComment = async (req, res) => {
  try {
    const validation =
      createCommentSchema.safeParse(
        req.body
      );

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.issues
      });
    }

    const { content } =
      validation.data;

    const postId =
      req.params.postId;

    const userId =
      req.user.id;

    // ===============================
    // Find post
    // ===============================

    const post =
      await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // ===============================
    // Only published posts can
    // receive comments
    // ===============================

    if (post.status !== "published") {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // ===============================
    // Create comment
    // ===============================

    const comment =
      await Comment.create({
        content,
        userId,
        postId
      });

    res.status(201).json({
      message:
        "Comment created successfully",
      comment
    });

  } catch (error) {
    console.error(
      "Create comment error:",
      error
    );

    res.status(500).json({
      message:
        "Something went wrong while creating the comment"
    });
  }
};

// ===============================
// Get Comments For A Post
// ===============================

const getCommentsByPost =
  async (req, res) => {
    try {
      const postId =
        req.params.postId;

      // ===============================
      // Find post
      // ===============================

      const post =
        await Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      // ===============================
      // Draft protection
      // ===============================

      if (
        post.status === "draft"
      ) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      // ===============================
      // Get comments
      // ===============================

      const comments =
        await Comment.findAll({
          where: {
            postId
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

          order: [
            ["createdAt", "ASC"]
          ]
        });

      res.status(200).json({
        count: comments.length,
        comments
      });

    } catch (error) {
      console.error(
        "Get comments error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while fetching comments"
      });
    }
  };

// ===============================
// Delete Comment
// ===============================

const deleteComment =
  async (req, res) => {
    try {
      const comment =
        await Comment.findByPk(
          req.params.id
        );

      if (!comment) {
        return res.status(404).json({
          message: "Comment not found"
        });
      }

      // ===============================
      // Ownership check
      // ===============================

      if (
        comment.userId !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to delete this comment"
        });
      }

      // ===============================
      // Delete comment
      // ===============================

      await comment.destroy();

      res.status(200).json({
        message:
          "Comment deleted successfully"
      });

    } catch (error) {
      console.error(
        "Delete comment error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while deleting the comment"
      });
    }
  };

module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment
};