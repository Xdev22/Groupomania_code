const mongoose = require("../db/db");

const commentSchema = mongoose.Schema({
  userId: { type: String, required: true },
  publicationId: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: false },
  imageUrl: { type: String, required: false },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false },
});

module.exports = mongoose.mongoose.model("Comment", commentSchema);
