const express = require("express");
const likescontroller = require("../controller/likes");
const router = express.Router();
router.get("/", likescontroller.getLikes);
router.post("/", likescontroller.addLike);
router.delete("/", likescontroller.deleteLikes);
module.exports = router;
