const express = require("express");

const router = express.Router();
const authCtrl = require("../controllers/auth");
//Auth = checkUser
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/user");

//AUTH
router.post("/auth/signup", authCtrl.signup);
router.post("/auth/login", authCtrl.login);
router.get("/auth/logout", authCtrl.logout);

//User
router.get("/", userCtrl.getAllUsers);
router.get("/:id", userCtrl.getOneUserInfo);
router.put("/:id", userCtrl.modifyOneUserInfo);
router.delete("/:id", userCtrl.deleteOneUser);
router.post("/follow/:id", userCtrl.follow);

module.exports = router;
