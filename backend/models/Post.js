
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM(
        "draft",
        "published"
      ),
      defaultValue: "draft",
      allowNull: false
    },

    // ===============================
    // Media
    // ===============================

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "posts",
    timestamps: true
  }
);

module.exports = Post;