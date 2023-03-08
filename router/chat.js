const express = require("express");
const router = express.Router();


// 导入路由处理的模块 
const chat_handler = require("../router-handler/chat");
// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入好友申请的校验规则

// 获取双人一对一聊天的消息表
router.get("/user/chat", chat_handler.getUserChat);
module.exports = router;