const User = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getAllUsers = (req, res, next) => {
  //Select permet de selectionner un element de la recherche
  User.find()
    .select("-password")
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneUserInfo = (req, res, next) => {
  //Si l'id de l'url ne correspond pas à un ObjectId de la base de donnée
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(404)
      .json({ message: `User not found ! ID unknow : ${req.params.id}` });
  } else {
    User.find({ _id: req.params.id })
      .select("-password")
      .then((user) => {
        console.log(user[0]), res.status(200).json(user[0]);
      })
      .catch((error) => res.status(404).json({ error }));
  }
};

exports.modifyOneUserInfo = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(404)
      .json({ message: `UserId: ${req.params.id} not found ! ` });
  }
  //recherche de l'utilisateur pour verifié si il est le propietaire du compte

  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user && user.id === req.auth.userId) {
        if (!req.body.password) {
          User.updateOne(
            { _id: req.params.id },
            {
              email: req.body.email,
              bio: req.body.bio,
              picture: "../client/public/uploads/" + req.file.filename,
            }
          )
            .then(() => res.status(200).json({ message: "User modified !" }))
            .catch((error) => res.status(500).json({ error }));
        } else {
          bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
              User.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    email: req.body.email,
                    password: hash,
                    bio: req.body.bio,
                  },
                }
              )
                .then(() =>
                  res.status(200).json({ message: "User modified !" })
                )
                .catch((error) => res.status(500).json({ error }));
            })
            .catch((error) => res.status(500).json({ error }));
        }
      } else {
        return res.status(401).json({ message: "Not allowed!" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteOneUser = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(404)
      .json({ message: `UserId: ${req.params.id} not found ! ` });
  }

  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user && user.id === req.auth.userId) {
        User.deleteOne({ _id: req.params.id })
          .then(() =>
            res
              .status(200)
              .json({ message: `UserId ${req.params.id} deleted !` })
          )
          .catch((error) => res.status(400).json({ error }));
      } else {
        return res.status(401).json({ message: "Not allowed!" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

/////////////////////////FOLLOWING/FOLLOWERS

exports.follow = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(404)
      .json({ message: `UserId: ${req.params.id} not found ! ` });
  } else if (!ObjectId.isValid(req.body.idToFollow)) {
    return res
      .status(404)
      .json({ message: `Follower: ${req.body.idToFollow} not found ! ` });
  }

  // ajouter le follower a la liste des following de l'user qui à été follow

  User.findOne({ _id: req.params.id })
    .then((follower) => {
      if (!follower.following.includes(req.body.idToFollow)) {
        User.updateOne(
          { _id: req.params.id },
          {
            $push: {
              following: req.body.idToFollow,
            },
          }
        ).catch((error) => res.status(400).json({ error }));

        User.findOne({ _id: req.body.idToFollow })
          .then((userFollowed) => {
            // Si l'user qui follow n'est pas dans la liste des following on l'ajoute
            if (!userFollowed.followers.includes(req.params.id)) {
              User.updateOne(
                { _id: req.body.idToFollow },
                {
                  $push: {
                    followers: req.params.id,
                  },
                }
              ).catch((error) => res.status(400).json({ error }));
            }
          })
          .catch((error) => res.status(400).json({ error }));

        return res.status(200).json({ message: "User followed !" });
      } else {
        User.updateOne(
          { _id: req.params.id },
          {
            $pull: {
              following: req.body.idToFollow,
            },
          }
        ).catch((error) => res.status(400).json({ error })),
          User.updateOne(
            { _id: req.body.idToFollow },
            {
              $pull: {
                followers: req.params.id,
              },
            }
          ).catch((error) => res.status(400).json({ error }));

        return res.status(200).json({ message: "User unfollowed !" });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

// exports.follw = (req, res, next) => {
//   // if (!ObjectId.isValid(req.params.id)) {
//   //   return res
//   //     .status(404)
//   //     .json({ message: `UserId: ${req.params.id} not found ! ` });
//   // } else if (!ObjectId.isValid(req.body.idToFollow)) {
//   //   return res
//   //     .status(404)
//   //     .json({ message: `Follower: ${req.body.idToFollow} not found ! ` });
//   // }

// ajouter le follower a la liste des following de l'user qui à été follow

//   User.findOne({ _id: req.params.id })
//     .then((follower) => {
//       //Si l'user qui follow n'est pas dans la liste des following on l'ajoute
//       if (!follower.following.includes(req.body.idToFollow)) {
//         User.updateOne(
//           { _id: req.params.id },
//           {
//             $push: {
//               following: req.body.idToFollow,
//             },
//           }).catch((error) => res.status(400).json({ error })),

//         User.findOne({ _id: req.body.idToFollow }).then((userFollowed) => {
// Si l'user qui follow n'est pas dans la liste des following on l'ajoute
//       if (!userFollowed.followers.includes(req.params.id)) {
//         User.updateOne(
//           { _id: req.body.idToFollow },
//           {
//             $push: {
//               following: req.params.id,
//             },
//           }
//         ).catch((error) => res.status(400).json({ error }))
//           // .then(() => {
//           //   res.status(200).json({
//           //     message: ` ${req.body.idToFollow} followed !`,
//           //   });
//           // })

//       } else {
//         User.updateOne(
//           { _id: req.params.id },
//           {
//             $pull: {
//               following: req.body.idToFollow,
//             },
//           }
//         ).catch((error) => res.status(400).json({ error })),

//         User.updateOne(
//                 { _id: req.body.idToFollow },
//                 {
//                   $pull: {
//                     following: req.params.id,
//                   },
//                 }
//               ) .catch((error) => res.status(400).json({ error }));
//       }
//     }).catch()
//   }
// }

// ajouter le follower a la liste des followers

// User.findOne({ _id: req.body.idToFollow })
//   .then((userFollowed) => {
//     //Si l'user qui follow n'est pas dans la liste des following on l'ajoute
//     if (!userFollowed.followers.includes(req.params.id)) {
//       User.updateOne(
//         { _id: req.body.idToFollow },
//         {
//           $push: {
//             following: req.params.id,
//           },
//         }
//       )
//         .then(() => {
//           res.status(200).json({
//             message: ` ${req.params.id} added to ${req.body.idToFollow} followers !`,
//           });
//         })
// .catch((error) => res.status(400).json({ error }));
//   } else {
//     User.updateOne(
//       { _id: req.body.idToFollow },
//       {
//         $pull: {
//           following: req.params.id,
//         },
//       }
//     )
//       .then(() =>
//         res
//           .status(200)
//           .json({
//             message: ` ${req.params.id} removed from ${req.body.idToFollow} followers !`,
//           })
//       )
//       .catch((error) => res.status(400).json({ error }));
//   }
// })
// .catch();

// User.updateOne(
//   { _id: req.body.idToFollow },
//   { $set: { followers: req.params.id } }
// )
//   .then(() =>
//     res.status(200).json({ message: "Added to the following list !" })
//   )
//   .catch((error) => res.status(500).json({ error }));
//}
