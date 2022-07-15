const Publication = require("../models/publication");
const User = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const result = dotenv.config();
//importation de fs
const fs = require("fs");

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

//--------------------------CRUD PUBLICATION-------------------------------

exports.findAllPublication = (req, res, next) => {
  Publication.find()
    .sort({ createdAt: -1 })
    .then((publications) => res.status(200).json(publications))

    .catch((error) => res.status(400).json({ error }));
};

exports.createPublication = (req, res) => {
  //S'il n'y a pas d'image:
  let publication = new Publication({
    userId: req.auth.userId,

    message: req.body.message,
    usersLiked: [],
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    comments: [],
  });
  //si il y a une image
  if (req.file) {
    publication = new Publication({
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/client/public/uploads/${
        req.file.filename
      }`,
      message: req.body.message,
      usersLiked: [],
      likes: 0,
      dislikes: 0,
      usersDisliked: [],
      comments: [],
    });
  }

  publication
    .save()
    .then(() => {
      res.status(201).json({ message: "Publication created !" });
    })
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
    return res.status(404).json({ message: `Publication not found !` });
  }

  //file ou non

  const publicationObject = req.file
    ? {
        message: req.body.message,
        imageUrl: `${req.protocol}://${req.get("host")}/client/public/uploads/${
          req.file.filename
        }`,
      }
    : { message: req.body.message };

  //recherche de la publication a mettre a jour puis verification si l'utilisateur est admin ou proprio
  Publication.findOne({ _id: req.params.id })
    .then((publication) => {
      let userAdmin = isAdmin(req);
      userAdmin.then((isAdmin) => {
        //si l'utilisateur est admin ou propietaire :
        if (publication.userId === req.auth.userId || isAdmin) {
          //s'il n'y avait pas d'image :
          if (publication.imageUrl == undefined) {
            Publication.updateOne(
              { _id: req.params.id },
              { $set: publicationObject }
            )
              .then(() => {
                res.status(200).json({ message: "Publication updated !" });
              })
              .catch((error) => res.status(500).json({ error }));
            //si il y  avait une image
          } else {
            console.log(publication.imageUrl);
            // fs.unlink pour supprimer le fichier
            const filename = publication.imageUrl.split("/uploads/")[1];
            fs.unlink(`client/public/uploads/${filename}`, () => {
              Publication.updateOne(
                { _id: req.params.id },
                { $set: publicationObject }
              )
                .then(() => {
                  res.status(200).json({ message: "Publication updated !" });
                })
                .catch((error) => res.status(500).json({ error }));
            });
          }

          // si pas admin et pas proprio:
        } else {
          return res.status(401).json({ message: "Not allowed!" });
        }
      });
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteOnePublication = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: `Publication not found !` });
  }
  //recherche de la publication a mettre a jour puis verification si l'utilisateur est admin ou proprio

  Publication.findOne({ _id: req.params.id })
    .then((publication) => {
      let userAdmin = isAdmin(req);

      userAdmin.then((isAdmin) => {
        //si l'utilisateur est admin ou propietaire :

        if (publication.userId === req.auth.userId || isAdmin) {
          //si il y a pas d'image:
          if (publication.imageUrl) {
            const filename = publication.imageUrl.split("/uploads/")[1];
            fs.unlink(`client/public/uploads/${filename}`, () => {
              Publication.deleteOne({ _id: req.params.id })
                .then(() =>
                  res.status(200).json({ message: "Publication deleted !" })
                )
                .catch((error) => res.status(500).json({ error }));
            });
          }
          Publication.deleteOne({ _id: req.params.id })
            .then(() =>
              res.status(200).json({ message: "Publication deleted !" })
            )
            .catch((error) => res.status(500).json({ error }));
        } else {
          return res.status(401).json({ message: "Not allowed!" });
        }
      });
    })
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
      if (!object.usersLiked.includes(req.auth.userId) && req.body.like === 1) {
        //mise à jour de DB
        Publication.updateOne(
          { _id: req.params.id },
          { $inc: { likes: 1 }, $push: { usersLiked: req.auth.userId } }
        )
          .then(() => res.status(201).json({ message: "Publication liked !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (
        object.usersLiked.includes(req.auth.userId) &&
        req.body.like === 0
      ) {
        Publication.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.auth.userId } }
        )
          .then(() => res.status(201).json({ message: " Like removed !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (
        !object.usersDisliked.includes(req.auth.userId) &&
        req.body.like === -1
      ) {
        Publication.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: 1 }, $push: { usersDisliked: req.auth.userId } }
        )
          .then(() =>
            res.status(201).json({ message: " Publication disliked !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (
        object.usersDisliked.includes(req.auth.userId) &&
        req.body.like === 0
      ) {
        Publication.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.auth.userId } }
        )
          .then(() => res.status(201).json({ message: " Dislike removed !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
