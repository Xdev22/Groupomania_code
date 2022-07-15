const express = require("express");
const commentCtrl = require("../controllers/comment");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/:id/comment", commentCtrl.findOneComment);
router.get("/:id/comments", commentCtrl.findAllComments);
router.post("/:id/comment", auth, commentCtrl.createComment);
// router.put("/:id/comment", commentCtrl.modifyComment);
router.put("/:id/comment/delete", auth, commentCtrl.deleteOneComment);
// router.post("/:id/like", commentCtrl.likeComment);

module.exports = router;
