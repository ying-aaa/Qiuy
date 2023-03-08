const express = require("express");
const router = express.Router();

const search_handler = require("../router-handler/search");
router.get("/search/user", search_handler.searchUser);


module.exports = router;
