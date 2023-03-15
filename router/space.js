const express = require("express");
const router = express.Router();
const space_handler = require("../router-handler/space");
router.post("/create/space", space_handler.createSpace);
router.get("/gain/space", space_handler.gainSpace);
module.exports = router;