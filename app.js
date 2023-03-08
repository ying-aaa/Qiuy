const express = require("express");
const app = express();
const path = require("path");
// 配置 socket.io 连接
const http = require('http');
const fs = require("fs");


// 网页socket配置
// const server = http.createServer(app);


const server = app.listen(3007);
const socket = require("./socket/index.js");
// 打开 @ 别名
require('module-alias/register');
// console.log(server);
socket.register(server);
socket.feed().on("connection", (socket) => {
    console.log("连接成功!123");
    socket.on("message", (msg) => {
        console.log(msg);
    })
})
// 打开聊天
require("./socket/friend.js");
require("./socket/chat.js");
require("./socket/group.js");

// 引入 cors 中间件, 配置跨域
const cors = require("cors");
app.use(cors({

}))

// 通过 express.json() 这个中间件, 解析表单中的 JSON 格式的数据
app.use(express.json());

// 导入解析 body-parser 表单数据的中间件 
const parser = require("body-parser");
app.use(parser.urlencoded({ extended: false }));

// // 配置解析 application/x-www-form-urlencode 表单数据的中间件
app.use(express.urlencoded({ extended: false }));

// 静态资源共享
// app.use(express.static(path.join(__dirname, "upload")));


// 导入 userModel 进行数据操作
// const mongoose = require("./model/users");
// const usersModel = require("./model/users");


// **一定要在路由之前**，使用全局中间件设置一个响应客户端数据的中间件函数供下游使用
app.use((req, res, next) => {
    // 设置 status 默认值为 1，表示失败的情况
    res.cc = function (err, status = 1) {
        // err的值，可能是一个错误对象，也可能时应该错误的描述字符串
        return res.send({
            status, message: err instanceof Error ? err.message : err
        })
    }
    next();
});
// 一定要在路由之前配置解析 token 的中间件
const expressJWT = require("express-jwt");
const config = require("./config/config");
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//, /^\/public\//] })); // [/^\/api\//]





// 导入并使用 user 用户模块
const user = require("./router/user");
app.use("/api", user);
// 导入并使用 userinfo 用户模块
const userInfo = require("./router/userInfo");
app.use(userInfo);
// 导入并使用 search 模块
const search = require("./router/search");
app.use(search);
// 导入并使用 friend 模块
const friend = require("./router/friend");
app.use(friend);
// 导入并使用 group 群模块
const group = require("./router/group");
app.use(group);
// 导入并使用 chat 聊天模块
const chat = require("./router/chat");
app.use(chat);



const { upload } = require("@/utils/util-multer");
app.post("/upload/file", upload.single("photo"), (req, res) => {
    console.log("访问到了这里");
    console.log(req.file);
    const chat_photo = ("http://127.0.0.1:3007\\" + req.file.path).replace(/\\/g, "/");

    res.send({
        status: 0,
        message: "发送图片成功！",
        data: chat_photo
    })
})








// 未找到的页面处理
// app.get("*", (req, res) => res.send("未找到，换一个试试吧！"));
// 读取图片的接口
app.get("*", (req, res) => {
    // console.log(req.url);
    fs.readFile(`./${req.url}`, (err, data) => {
        if (err) return res.send("未找到，换一个试试吧！");
        // console.log(data);
        res.send(data);
    })
})
app.post("*", (req, res) => res.send("未找到，换一个试试吧！"));




const joi = require("joi");
// 定义错误级别的中间件
app.use((err, req, res, next) => {

    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err);
    console.log(111111111, err);
    // token 解析验证失败的错误
    if (err.name === "UnauthorizedError") return res.cc("token 身份认证失败");


    // 未知的错误 --- 在 express中，不允许使用超过一次 res.send()
    res.send(err);
})


app.listen(3001, () => {
    console.log("express server running at http://127.0.0.1:3001");
})



// server.listen(3007, () => {
//     console.log('listening on *:3007');
// });
// 小程序中weapp.socket.io连接不上后端socket.io