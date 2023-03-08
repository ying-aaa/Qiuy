const express = require("express");
const router = express.Router();


// 导入用户路由处理的模块 
const friend_handler = require("../router-handler/friend");
// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入好友申请的校验规则
const { add_friend_schema, handler_friend_schema } = require("../schema/friend");
router.post("/add/friend", expressJoi(add_friend_schema), friend_handler.addFriend);
router.get("/look/friend", friend_handler.lookFriend);
router.post("/handler/friend", expressJoi(handler_friend_schema), friend_handler.handlerFriend);
router.get("/delete/friend", friend_handler.deleteFriend);
router.post("/friend/call", friend_handler.friendCall);

router.post("/clear/tip", friend_handler.clearTip);
// router.post("/friend/msg", friend_handler.friendMsg)
module.exports = router;