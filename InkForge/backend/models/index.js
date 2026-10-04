
const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

// ===============================
// User ↔ Post
// ===============================

User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});

Post.belongsTo(User, {
  foreignKey: "userId"
});

// ===============================
// User ↔ Comment
// ===============================

User.hasMany(Comment, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});

Comment.belongsTo(User, {
  foreignKey: "userId"
});

// ===============================
// Post ↔ Comment
// ===============================

Post.hasMany(Comment, {
  foreignKey: "postId",
  onDelete: "CASCADE"
});

Comment.belongsTo(Post, {
  foreignKey: "postId"
});

module.exports = {
  User,
  Post,
  Comment
};