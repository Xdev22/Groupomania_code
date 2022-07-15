const express = require("express");

const router = express.Router();
const authCtrl = require("../controllers/auth");
//Auth = checkUser
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/user");

const multer = require("../middleware/multer-config");
// const upload = multer();
const uploadCtrl = require("../controllers/upload");

//AUTH
router.post("/auth/signup", authCtrl.signup);
router.post("/auth/login", authCtrl.login);
router.get("/auth/logout", auth, authCtrl.logout);

//User
router.get("/", auth, userCtrl.getAllUsers);
router.get("/:id", auth, userCtrl.getOneUserInfo);
router.put("/:id", auth, multer, userCtrl.modifyOneUserInfo);
router.delete("/:id", auth, userCtrl.deleteOneUser);
router.post("/follow/:id", auth, userCtrl.follow);

//upload

router.post("/upload", multer, uploadCtrl.uploadProfil);

module.exports = router;
