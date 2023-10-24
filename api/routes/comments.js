const express = require("express");
const commentscontroller = require("../controller/comments");
const router = express.Router();
router.get("/Comments", commentscontroller.getComments);
router.post("/add-comments", commentscontroller.addComments);
module.exports = router;
