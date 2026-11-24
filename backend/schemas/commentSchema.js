
const { z } = require("zod");

// ===============================
// Create Comment Schema
// ===============================

const createCommentSchema = z.object({
  content: z
    .string()
    .min(2, "Comment must be at least 2 characters long")
    .max(1000, "Comment cannot exceed 1000 characters")
});

module.exports = {
  createCommentSchema
};