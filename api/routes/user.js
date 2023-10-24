const express = require("express")
const usercontroller= require("../controller/user")
const router = express.Router()
router.get("/:currentUserID", usercontroller.getAllUnfriends);
router.get("/friends/:currentUserID", usercontroller.getFriends);
router.get("/followers/:currentUserID", usercontroller.getFollowers);
router.get("/find/:user_id", usercontroller.getUser);
router.put("/", usercontroller.updateUser);
module.exports = router