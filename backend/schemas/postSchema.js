
const { z } = require("zod");

const createPostSchema = z.object({
  title: z
    .string()
    .min(
      3,
      "Title must be at least 3 characters long"
    )
    .max(
      200,
      "Title cannot exceed 200 characters"
    ),

  content: z
    .string()
    .min(
      10,
      "Content must be at least 10 characters long"
    ),

  category: z
    .string()
    .min(
      2,
      "Category must be at least 2 characters long"
    )
    .optional(),

  status: z
    .enum([
      "draft",
      "published"
    ])
    .optional(),

  imageUrl: z
    .string()
    .url(
      "Image URL must be a valid URL"
    )
    .optional()
});

const updatePostSchema = z.object({
  title: z
    .string()
    .min(
      3,
      "Title must be at least 3 characters long"
    )
    .max(
      200,
      "Title cannot exceed 200 characters"
    )
    .optional(),

  content: z
    .string()
    .min(
      10,
      "Content must be at least 10 characters long"
    )
    .optional(),

  category: z
    .string()
    .min(
      2,
      "Category must be at least 2 characters long"
    )
    .optional(),

  status: z
    .enum([
      "draft",
      "published"
    ])
    .optional(),

  imageUrl: z
    .string()
    .url(
      "Image URL must be a valid URL"
    )
    .optional()
});

module.exports = {
  createPostSchema,
  updatePostSchema
};