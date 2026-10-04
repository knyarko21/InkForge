
const {
  Op
} = require("sequelize");

const Post =
  require("../models/Post");

const User =
  require("../models/User");

const {
  createPostSchema,
  updatePostSchema
} = require("../schemas/postSchema");

// =====================================
// Get All Published Posts
// =====================================

const getAllPosts =
  async (req, res) => {
    try {
      const search =
        req.query.search?.trim() ||
        "";

      const where = {
        status: "published"
      };

      if (search) {
        where[Op.or] = [
          {
            title: {
              [Op.like]:
                `%${search}%`
            }
          },

          {
            content: {
              [Op.like]:
                `%${search}%`
            }
          },

          {
            category: {
              [Op.like]:
                `%${search}%`
            }
          }
        ];
      }

      const posts =
        await Post.findAll({
          where,

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
            [
              "createdAt",
              "DESC"
            ]
          ]
        });

      let filteredPosts =
        posts;

      if (search) {
        const normalizedSearch =
          search.toLowerCase();

        filteredPosts =
          posts.filter(
            (post) => {
              const user =
                post.User;

              if (!user) {
                return false;
              }

              const fullName =
                `${user.firstName} ${user.lastName}`
                  .toLowerCase();

              return (
                fullName.includes(
                  normalizedSearch
                ) ||

                user.username
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  ) ||

                post.title
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  ) ||

                post.content
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  ) ||

                (
                  post.category ||
                  ""
                )
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  )
              );
            }
          );
      }

      res.status(200).json({
        count:
          filteredPosts.length,

        search:
          search || null,

        posts:
          filteredPosts
      });
    } catch (error) {
      console.error(
        "Get posts error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while fetching posts"
      });
    }
  };

// =====================================
// Get Single Post
// =====================================

const getPostById =
  async (req, res) => {
    try {
      const post =
        await Post.findByPk(
          req.params.id,
          {
            include: {
              model: User,

              attributes: [
                "id",
                "firstName",
                "lastName",
                "username"
              ]
            }
          }
        );

      if (!post) {
        return res.status(404).json({
          message:
            "Post not found"
        });
      }

      if (
        post.status ===
        "draft"
      ) {
        const isOwner =
          req.user &&
          Number(req.user.id) ===
            Number(
              post.userId
            );

        if (!isOwner) {
          return res.status(404).json({
            message:
              "Post not found"
          });
        }
      }

      res.status(200).json({
        post
      });
    } catch (error) {
      console.error(
        "Get post error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while fetching the post"
      });
    }
  };

// =====================================
// Create Post
// =====================================

const createPost =
  async (req, res) => {
    try {
      const validation =
        createPostSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          message:
            "Validation failed",

          errors:
            validation.error.issues
        });
      }

      const {
        title,
        content,
        category,
        status,
        imageUrl
      } = validation.data;

      const post =
        await Post.create({
          title,

          content,

          category:
            category || null,

          status:
            status || "draft",

          imageUrl:
            imageUrl || null,

          userId:
            req.user.id
        });

      res.status(201).json({
        message:
          "Post created successfully",

        post
      });
    } catch (error) {
      console.error(
        "Create post error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while creating the post"
      });
    }
  };

// =====================================
// Update Post
// =====================================

const updatePost =
  async (req, res) => {
    try {
      const validation =
        updatePostSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          message:
            "Validation failed",

          errors:
            validation.error.issues
        });
      }

      const post =
        await Post.findByPk(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          message:
            "Post not found"
        });
      }

      if (
        Number(post.userId) !==
        Number(req.user.id)
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to update this post"
        });
      }

      const {
        title,
        content,
        category,
        status,
        imageUrl
      } = validation.data;

      const updateData = {
        title:
          title ?? post.title,

        content:
          content ?? post.content,

        category:
          category ?? post.category,

        status:
          status ?? post.status,

        imageUrl:
          imageUrl ?? post.imageUrl
      };

      await post.update(
        updateData
      );

      res.status(200).json({
        message:
          "Post updated successfully",

        post
      });
    } catch (error) {
      console.error(
        "Update post error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while updating the post"
      });
    }
  };

// =====================================
// Delete Post
// =====================================

const deletePost =
  async (req, res) => {
    try {
      const post =
        await Post.findByPk(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          message:
            "Post not found"
        });
      }

      if (
        Number(post.userId) !==
        Number(req.user.id)
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to delete this post"
        });
      }

      await post.destroy();

      res.status(200).json({
        message:
          "Post deleted successfully"
      });
    } catch (error) {
      console.error(
        "Delete post error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while deleting the post"
      });
    }
  };

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};