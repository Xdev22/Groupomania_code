const express = require("express");

const router = express.Router();
const authCtrl = require("../controllers/auth");
//Auth = checkUser
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/user");

//AUTH
router.post("/auth/signup", authCtrl.signup);
router.post("/auth/login", authCtrl.login);
router.get("/auth/logout", auth, authCtrl.logout);

//User
router.get("/", auth, userCtrl.getAllUsers);
router.get("/:id", auth, userCtrl.getOneUserInfo);
router.put("/:id", auth, userCtrl.modifyOneUserInfo);
router.delete("/:id", auth, userCtrl.deleteOneUser);
router.post("/follow/:id", auth, userCtrl.follow);

module.exports = router;
