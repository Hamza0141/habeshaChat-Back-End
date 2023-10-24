const express = require("express");
const messagescontroller = require("../controller/message");
const router = express.Router();
router.get("/getMessage", messagescontroller.getmessage);
router.post("/addMessage", messagescontroller.addMessage);
module.exports = router;
