
const { z } = require("zod");

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(50, "Last name cannot exceed 50 characters"),

  email: z
    .string()
    .email("Please provide a valid email address"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username cannot exceed 30 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
});

const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
});

module.exports = {
  registerSchema,
  loginSchema
};