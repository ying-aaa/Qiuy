const express = require("express");
const router = express.Router();


// 导入用户路由处理的模块
const user_handler = require("../router-handler/user");
// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入用户名与密码的校验规则
const { reg_login_schema } = require("../schema/user");

router.post("/reguser", expressJoi(reg_login_schema), user_handler.regUser)
router.post("/login", expressJoi(reg_login_schema), user_handler.login);

module.exports = router;