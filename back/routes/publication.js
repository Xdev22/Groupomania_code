const express = require("express");
const publicationCtrl = require("../controllers/publication");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
// const multer = require("../middleware/multer-config");

router.get("/", auth, publicationCtrl.findAllPublication);
router.post("/", auth, multer, publicationCtrl.createPublication);
router.get("/:id", auth, publicationCtrl.findOnePublication);
router.put("/:id", auth, multer, publicationCtrl.modifyPublication);
router.delete("/:id", auth, multer, publicationCtrl.deleteOnePublication);
router.post("/:id/like", auth, publicationCtrl.likePublication);

module.exports = router;
