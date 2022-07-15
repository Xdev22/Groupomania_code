const User = require("../models/user");

module.exports.uploadProfil = async (req, res) => {
  res.status(200).json(req.file);
};
