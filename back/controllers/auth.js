const User = require("../models/user");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET);
};

exports.signup = (req, res, next) => {
  if (req.body.password.length < 8 || req.body.password.length > 1024) {
    res.status(409).json({
      message: "Le mot de passe doit contenir au minimum 8 caractères",
    });
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          ...req.body,
          password: hash,
        });

        user
          .save()
          .then((user) => {
            //On retourne le cookie afin d'authentifier la personne
            const token = createToken(user.id);
            res.cookie("jwt", token, { httpOnly: true });
            res
              .status(201)
              .json({ message: `User created ! UserId: ${user._id}` });
          })
          .catch((err) => {
            if (user) {
              return res.status(409).json({
                message: "Un compte existe avec cette adresse mail",
              });
            } else {
              return res.status(400).json({ error });
            }
          });
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Adresse mail introuvable !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorrecte !" });
          } else {
            const token = createToken(user.id);
            console.log(user.id);
            res.cookie("jwt", token, { httpOnly: true });
            res.status(200).json({
              userId: user.id,
            });
          }
        })
        .catch((error) => res.status(500).json(error.message));
    })
    .catch((error) => res.status(500).json(error.message));
};

exports.verifTokken = (req, res) => {
  if (req.auth.userId) {
    res.status(200).json(req.auth.userId);
  } else {
    throw "No token";
  }
};

exports.logout = (req, res, next) => {
  // res.clearCookie("jwt");
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json("c");
  res.redirect = "/profil";
};
