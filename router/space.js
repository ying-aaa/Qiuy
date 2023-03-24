const express = require("express");
const router = express.Router();
const space_handler = require("../router-handler/space");
router.post("/create/space", space_handler.createSpace);
router.get("/gain/space", space_handler.gainSpace);
router.post("/comment/space", space_handler.commentSpace);
router.get("/dynamic/comment", space_handler.dynamicComment);
module.exports = router;