const express = require("express");
const publicationCtrl = require("../controllers/publication");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth, publicationCtrl.findAllPublication);
router.post("/", auth, publicationCtrl.createPublication);
router.get("/:id", auth, publicationCtrl.findOnePublication);
router.put("/:id", auth, publicationCtrl.modifyPublication);
// router.delete("/:id", publicationCtrl.deleteOnePublication);
// router.post("/:id/like", publicationCtrl.likePublication);

module.exports = router;
