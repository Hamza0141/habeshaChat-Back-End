const express = require("express");
const messagescontroller = require("../controller/message");
const router = express.Router();
router.get("/getMessage", messagescontroller.getmessage);
router.get("/getSingleMessage", messagescontroller.singleMessage);
router.post("/addMessage", messagescontroller.addMessage);
module.exports = router;
