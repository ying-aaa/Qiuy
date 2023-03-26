// 这是一个全局的配置文件

module.exports = {
    // 这是加密和解密 token 的密钥
    jwtSecretKey: "itqiuy No.1 (●'◡'●)",
    // token 的有效期
    expiresIn: "10h",
    // 链接的 qq 邮箱
    qq: {
        user: "775296271@qq.com",
        pass: "zhongfncbincbahj"
    },
    // 部署的可以使用的环境变量
    envs: ["computer", "android"],
    // mongodb数据库配置
    db: {
        uri: "mongodb+srv://qiuy:ZHANGli040905@qiuy.f2ry03c.mongodb.net/?retryWrites=true&w=majority"
    }
}