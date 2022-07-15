//Fonction multer permet de gérer les images
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

const storage = multer.diskStorage({
  //Destination du fichier
  destination: (req, file, callback) => {
    //images : nom du dossier de destination
    callback(null, "client/public/uploads");
  },
  //Gérer le nom du fichier
  filename: (req, file, callback) => {
    //Le nom du fichier/nom d'origine+supprimer les espaces et ajouter des _
    const name = file.originalname.split(" ").join("_");
    //Gerer l'extension
    if (!file.mimetype) {
      const extension = MIME_TYPES[file.mimetype];
      callback(null, req.auth.userId + Date.now() + name + "." + extension);
    } else {
      callback(null, req.auth.userId + Date.now() + name);
    }
  },
});

module.exports = multer({ storage: storage }).single("file");
