// 导入数据库操作模块
const userModel = require("../model/users");
// 导入加密密码的包
const bcrypt = require("bcryptjs");
// 导入生成 token 令牌的包
const jwt = require("jsonwebtoken");
// 导入全局的加密与解密的密钥及使用到的token有效期
const config = require("../config/config");

exports.regUser = (req, res) => {
    console.log("有用户注册了");
    let { username, password, email } = req.body;
    // console.log(req.body);
    // 查询用户名是否被注册
    userModel.find({ username }, (err, docs) => {
        if (err) return res.cc(err);
        if (docs.length !== 0) return res.cc("该用户名已被占用,换一个试试吧!");
        password = bcrypt.hashSync(password, 10);
        const create_time = Date.now();
        const user = new userModel({
            username, password, sing: "该用户很懒的，什么都没写呢！", create_time, email
        })
        user.save((err, docs2) => {
            if (err) return res.cc(err);
            if (docs2.username) res.cc("恭喜你,注册用户成功!", 0);
        })
    })
}
exports.login = (req, res) => {
    let { username, password } = req.body;
    userModel.find({ username }, (err, docs) => {
        if (err) return res.cc(err);
        if (docs.length === 0) return res.cc("未找到用户名!");
        // 验证密码
        const cmppareRuselt = bcrypt.compareSync(password, docs[0]._doc.password);
        if (!cmppareRuselt) return res.cc("密码错误!");

        // 用于生成 token 令牌的信息
        const user = { ...docs[0]._doc, password: "", };
        // 生成 token 令牌 // token 有效期
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
        let data = docs[0]._doc;
        Reflect.deleteProperty(data, "password");
        res.send({
            status: 0,
            message: "登陆成功!",
            data,
            token: "Bearer " + tokenStr
        })
    })
}
