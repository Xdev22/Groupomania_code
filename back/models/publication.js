const mongoose = require("../db/db");

const publicationSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, required: false, maxlength: 500, trim: true },
    imageUrl: { type: String, required: false },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: {
      type: [
        {
          userId: String,
          userName: String,
          comment: String,
          timestamps: Number,
        },
      ],
    },
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.mongoose.model("Publication", publicationSchema);
