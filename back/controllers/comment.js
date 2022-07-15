const Publication = require("../models/publication");
const User = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");

//Fonction qui verifie si l'user est admin.

let isAdmin = (req) => {
  return User.findOne({ _id: req.auth.userId })
    .then((user) => {
      console.log("userIsAdmin");
      console.log(user.admin);
      return user.admin;
    })
    .catch((error) => {
      console.log("error fonction isAdmin");
      console.log(error);
    });
};

//--------------------------CRUD COMMENT-------------------------------

exports.createComment = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: `Publication not found !` });
  }

  User.findOne({ _id: req.auth.userId })
    .then((user) => {
      Publication.updateOne(
        { _id: req.params.id },

        {
          $push: {
            comments: [
              {
                userId: req.auth.userId,
                userName: `${user.lastName} ${user.firstName}`,
                comment: req.body.comment,
                timestamps: Date.now(),
              },
            ],
          },
        }
      )
        .then(() =>
          res.status(201).json({ message: "Publication commented !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.findAllComments = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: `comment not found !` });
  }

  Publication.find({ _id: req.params.id })
    .then((publication) => {
      let comments = publication[0].comments;
      console.log(comments);
      res.status(200).json(comments);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.findOneComment = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: `comment not found !` });
  }

  Publication.find(
    { _id: req.params.id },

    { comments: { $elemMatch: { _id: req.body.commentId } } }
  )
    .then((commentsArray) => {
      let comment = commentsArray[0].comments[0];
      console.log(commentsArray[0].comments[0]);
      res.status(200).json(comment);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteOneComment = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: `comment not found !` });
  }
  console.log("req.auth.userId");
  console.log(req.auth.userId);

  Publication.findOne(
    { _id: req.params.id },
    { comments: { $elemMatch: { _id: req.body.commentId } } }
  )
    .then((commentsArray) => {
      let commentUserId = commentsArray.comments[0].userId;
      console.log("commentUserId");
      console.log(commentUserId);
      let userAdmin = isAdmin(req);
      userAdmin.then((isAdmin) => {
        if (commentUserId === req.auth.userId || isAdmin) {
          Publication.updateOne(
            { _id: req.params.id },
            { $pull: { comments: { _id: req.body.commentId } } }
          )
            .then(() => res.status(200).json({ message: "Comment deleted !" }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          return res.status(401).json({ message: "Not allowed!" });
        }
      });
    })
    .catch((error) => res.status(400).json({ error }));

  // Publication.findOne({ _id: req.params.id })
  //   .then((publication) => {
  //     // let commentUserId = commentsArray[0].comments[0];
  //     // let userAdmin = isAdmin(req);
  //     console.log(publication.comments);
  //     // userAdmin
  //     //   .then((isAdmin) => {
  //     //     if (commentUserId === req.auth.userId || isAdmin) {
  //     //       Publication.updateOne(
  //     //         { _id: req.params.id },
  //     //         { $pull: { comments: { _id: req.body.commentId } } }
  //     //       )
  //     //         .then(() =>
  //     //           res.status(200).json({ message: "Comment deleted !" })
  //     //         )
  //     //         .catch((error) => res.status(400).json({ error }));
  //     //     }
  //     //   })
  //     //   .catch(res.status(401).json({ message: "Not allowed!" }));
  //   })
  //   .catch((error) => res.status(404).json({ error }));
};

// exports.deleteOnePublication = (req, res, next) => {
//   Publication.deleteOne({ _id: req.params.id })
//     .then(() => res.status(200).json({ message: "Publication deleted !" }))
//     .catch((error) => res.status(400).json({ error }));
// };

// //-------------------------LIKE---------------------------
// exports.likePublication = (req, res, next) => {
//   Publication.findOne({ _id: req.params.id })
//     .then((object) => {
//       //Gerer le like=1

//       // console.log(req.body.like);
//       //Si l'utilisateur qui à liker n'est pas dans les usersLiked de la base de donnée et que le like de la requête est à 1 alors :
//       if (!object.usersLiked.includes(req.body.userId) && req.body.like === 1) {
//         //mise à jour de DB
//         Publication.updateOne(
//           { _id: req.params.id },
//           { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
//         )
//           .then(() => res.status(201).json({ message: "Publication liked !" }))
//           .catch((error) => res.status(400).json({ error }));
//       } else if (
//         object.usersLiked.includes(req.body.userId) &&
//         req.body.like === 0
//       ) {
//         Publication.updateOne(
//           { _id: req.params.id },
//           { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
//         )
//           .then(() => res.status(201).json({ message: " Like removed !" }))
//           .catch((error) => res.status(400).json({ error }));
//       } else if (
//         !object.usersDisliked.includes(req.body.userId) &&
//         req.body.like === -1
//       ) {
//         Publication.updateOne(
//           { _id: req.params.id },
//           { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
//         )
//           .then(() =>
//             res.status(201).json({ message: " Publication disliked !" })
//           )
//           .catch((error) => res.status(400).json({ error }));
//       } else if (
//         object.usersDisliked.includes(req.body.userId) &&
//         req.body.like === 0
//       ) {
//         Publication.updateOne(
//           { _id: req.params.id },
//           { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
//         )
//           .then(() => res.status(201).json({ message: " Dislike removed !" }))
//           .catch((error) => res.status(400).json({ error }));
//       }
//     })
//     .catch((error) => res.status(404).json({ error }));
// };
