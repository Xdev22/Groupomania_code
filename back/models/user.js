const mongoose = require("../db/db");
const uniqueValidator = require("mongoose-unique-validator");
const { isEmail } = require("validator");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      trimp: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      trimp: true,
    },
    //trimp permet de supprimer les espaces après l'entrée des données
    //lowercase permet de tout mettre en miniscule
    email: {
      type: String,
      required: true,
      unique: true,
      trimp: true,
      lowercase: true,
      validate: [isEmail],
    },
    password: { type: String, required: true, minlength: 8, maxlength: 1024 },
    admin: { type: Boolean, default: false },
    picture: {
      type: String,
      default: `http://localhost:3000/client/public/uploads/random-user.png`,
    },
    bio: { type: String, maxlength: 1024 },
    followers: { type: [String] },
    following: { type: [String] },
    likes: { type: [String] },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.mongoose.model("User", userSchema);

Date.now();
