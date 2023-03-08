// 连接数据库
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/qiuy", { useNewUrlParser: true }, err => {
    if (err) return console.log("数据库连接失败");
    console.log("数据库连接成功");
});
module.exports = mongoose;