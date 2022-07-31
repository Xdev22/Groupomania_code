const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const result = dotenv.config();
const User = require("../models/user");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.id;
    req.auth = { userId };
    // console.log("userId-----------");
    // console.log(userId);
    User.findOne({ _id: userId })
      .select("-password")
      .then((user) => {
        console.log("userId qui fait la requête  (middleware auth)");
        console.log(userId);

        if (user.id === userId) {
          next();
        } else {
          throw "Non autorisé !";
        }
      })
      .catch((error) => res.status(404).json({ error }));
  } catch (error) {
    res.status(401).json({ error });
  }
};

// module.exports = (req, res, next) => {
//   //recherché l'userId, recherché dans la db son compte et verifié si il est admin
//   User.findOne({ _id: userId }).then((user) => {
//     console.log(user);
//   });
// };
