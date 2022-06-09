const mongoose = require("../db/db");

const publicationSchema = mongoose.Schema(
  {
    posterId: { type: String, required: true },
    message: { type: String, required: false, maxlength: 500, trim: true },
    imageUrl: { type: String, required: false },
    video: { type: String, required: false },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: {
      type: [
        {
          commenterId: String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
        },
      ],
    },
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.mongoose.model("Publication", publicationSchema);
