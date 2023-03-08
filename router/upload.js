const express = require("express");
const router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
router.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file 是 `avatar` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    console.log(req.files);
    res.cc("成功了")
})
module.exports = router;