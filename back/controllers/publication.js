const Publication = require("../models/publication");
const User = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;

//--------------------------CRUD PUBLICATION-------------------------------

exports.findAllPublication = (req, res, next) => {
  Publication.find()
    .then((publications) => res.status(200).json(publications))
    .catch((error) => res.status(400).json({ error }));
};

exports.createPublication = (req, res, next) => {
  const publication = new Publication({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    usersLiked: [],
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    comments: [],
  });
  publication
    .save()
    .then(() => res.status(201).json({ message: "Publication created !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.findOnePublication = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(404)
      .json({ message: `User not found ! ID unknow : ${req.params.id}` });
  }
  Publication.findOne({ _id: req.params.id })
    .then((publication) => res.status(200).json(publication))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifyPublication = (req, res, next) => {
  //Si l'id de l'url ne correspond pas à un ObjectId de la base de donnée
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(404)
      .json({ message: `User not found ! ID unknow : ${req.params.id}` });
  }
  Publication.updateOne(
    { _id: req.params.id },
    { $set: { message: req.body.message } }
  )
    .then(() => res.status(200).json({ message: "Publication updated !" }))
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteOnePublication = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(404)
      .json({ message: `User not found ! ID unknow : ${req.params.id}` });
  }
  Publication.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Publication deleted !" }))
    .catch((error) => res.status(400).json({ error }));
};

//-------------------------LIKE---------------------------
exports.likePublication = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(404)
      .json({ message: `User not found ! ID unknow : ${req.params.id}` });
  }
  Publication.findOne({ _id: req.params.id })
    .then((object) => {
      //Gerer le like=1

      // console.log(req.body.like);
      //Si l'utilisateur qui à liker n'est pas dans les usersLiked de la base de donnée et que le like de la requête est à 1 alors :
      if (!object.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        //mise à jour de DB
        Publication.updateOne(
          { _id: req.params.id },
          { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(201).json({ message: "Publication liked !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (
        object.usersLiked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Publication.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(201).json({ message: " Like removed !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (
        !object.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        Publication.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
        )
          .then(() =>
            res.status(201).json({ message: " Publication disliked !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (
        object.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Publication.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(() => res.status(201).json({ message: " Dislike removed !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

//pour chaque commentaire : comment++

// if user !includes && req.body= +1
////mise à jour de DB
//  Publication.updateOne(
//     { _id: req.params.id },
//     { $inc: { comments: 1 }, $push: { usersCommented: req.body.userId } }
//   )
//     .then(() => res.status(201).json({ message: "Publication commented !" }))
//     .catch((error) => res.status(400).json({ error }));

// if user includes && req.body===+1
// Publication.updateOne(
//     { _id: req.params.id },
//     { $inc: { comments: 1 } }
//   )
//     .then(() => res.status(201).json({ message: "Publication commented !" }))
//     .catch((error) => res.status(400).json({ error }));
