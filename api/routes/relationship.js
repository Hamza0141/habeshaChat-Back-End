const express = require("express");
const likescontroller = require("../controller/relationship");
const router = express.Router();
router.get("/", likescontroller.getRelationships);
router.post("/", likescontroller.addRelationships);
router.delete("/", likescontroller.deleteRelationships);
module.exports = router;
