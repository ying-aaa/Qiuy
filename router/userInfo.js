require('module-alias/register');
const express = require("express");
const router = express.Router();
const expressJoi = require("@escook/express-joi")

const userInfo_handler = require("../router-handler/userInfo");
const { update_nickname_schema, update_password_schema, update_avatar_schems } = require("../schema/user");

router.get("/userinfo", userInfo_handler.getUserInfo);
router.post("/userinfo", expressJoi(update_nickname_schema), userInfo_handler.updateUserInfo);
router.post("/updatepwd", expressJoi(update_password_schema), userInfo_handler.updatePwd);

const { upload } = require("@/utils/util-multer");
// 更新用户头像
router.post("/update/avater", expressJoi(update_avatar_schems), upload.single('file'), userInfo_handler.updateAvater);

module.exports = router;






