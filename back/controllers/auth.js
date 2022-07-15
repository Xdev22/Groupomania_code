const User = require("../models/user");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET);
};

exports.signup = (req, res, next) => {
  if (req.body.password.length < 8 || req.body.password.length > 1024) {
    res.status(409).json({
      message: "Le mot de passe doit contenir entre 8 et 100 caractères",
    });
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          ...req.body,
          password: hash,
        });

        user.save().then((user) => {
          res
            .status(201)
            .json({ message: `User created ! UserId: ${user._id}` });
        });
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Wrong email address !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "Password Wrong!" });
          } else {
            const token = createToken(user._id);
            console.log(user._id);
            res.cookie("jwt", token, { httpOnly: true });
            res.status(200).json({
              userId: user._id,
            });
          }
        })
        .catch((error) => res.status(500).json(error.message));
    })
    .catch((error) => res.status(500).json(error.message));
};

exports.logout = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
