const express = require("express");
const router = express.Router();



const group_handler = require("../router-handler/group");
const { create_group_schema } = require("../schema/group");
const expressJoi = require("@escook/express-joi");
const { upload } = require("@/utils/util-multer");


router.post("/create/group", expressJoi(create_group_schema), group_handler.createGroup);
router.post("/join/group", group_handler.JoinGroup);
router.get("/group/chat", group_handler.groupChat);
router.get("/group/menber", group_handler.groupMenber);


router.post("/handler/menber", group_handler.handlerMenber);

// 更换群头像
router.post("/group/avater", upload.single("file"), group_handler.groupAvater);
// 修改群信息
router.post("/handler/group", group_handler.handlerGroup);







router.post("/group/info", group_handler.groupInfo);
router.post("/interior/name", group_handler.interiorName);

module.exports = router;
