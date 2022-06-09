const express = require("express");
const commentCtrl = require("../controllers/comment");
const router = express.Router();

router.get("/", commentCtrl.findAllComment);
router.post("/", commentCtrl.createComment);
router.get("/:id", commentCtrl.findOneComment);
// router.put("/:id", commentCtrl.modifyComment);
// router.delete("/:id", commentCtrl.deleteOneComment);
// router.post("/:id/like", commentCtrl.likeComment);

module.exports = router;
