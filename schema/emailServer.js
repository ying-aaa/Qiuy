// 引用发送 邮件 插件
const nodemailer = require("nodemailer");
// 引入邮箱证书文件
const config = require("../config/config");
// 创建传输方式
const transporter = nodemailer.createTransport({
    service: "qq",
    auth: {
        user: config.qq.user,
        pass: config.qq.pass
    }
});

// 注册发送邮件给用户
exports.emailSingUp = function (email, res) {
    // 发送信息
    const options = {
        from: "775296271@qq.com",
        to: email,
        subject: "qiuy 你好",
        html: "<b>Hello world!</b><a href='http://127.0.0.1'>去看看吧!</a>"
    };
    transporter.sendMail(options, (err, msg) => {
        if (err) return console.log("发送失败", err);
        console.log("邮箱发送成功");
    })
}
exports.emailSingUp("775296271@qq.com");