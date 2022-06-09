const Comment = require("../models/comment");
const Publication = require("../models/publication");

//--------------------------CRUD COMMENT-------------------------------

exports.findAllComment = (req, res, next) => {
  console.log(req.body);
  if (req.body.publicationId === req.params.id) {
    Comment.find()
      .then((comments) => res.status(200).json(comments))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(404).json({ message: "reger not found !" });
  }
};

exports.createComment = (req, res, next) => {
  const comment = new Comment({
    ...req.body,
  });
  if (req.body.publicationId === req.params.id) {
    comment
      .save()
      .then(() => res.status(201).json({ message: "Comment created !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    console.log("--------------------");
    console.log(req.body);
    console.log("--------------------");
    console.log(req.params.id);
    res.status(404).json({ message: "Publication not found !" });
  }

  //   console.log("---------------------");
  //   console.log();
};

exports.findOneComment = (req, res, next) => {
  console.log(req.params.id);
  Comment.findOne({ _id: req.params.id })
    .then((comment) => res.status(200).json(comment))
    .catch((error) => res.status(404).json({ error }));
};

// exports.modifyPublication = (req, res, next) => {
//   Publication.updateOne(
//     { _id: req.params.id },
//     { ...req.body, _id: req.params.id }
//   )
//     .then(() => res.status(200).json({ message: "Publication updated !" }))
//     .catch((error) => res.status(500).json({ error }));
// };

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
