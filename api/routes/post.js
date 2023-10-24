const express = require("express");
const postcontroller = require("../controller/post");
const router = express.Router();
router.get("/", postcontroller.getPost);
router.get("/stories/:currentUserID", postcontroller.getStorePosts);
router.post("/", postcontroller.addPost);
router.delete("/:id", postcontroller.deletePost);
module.exports = router;