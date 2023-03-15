const dotenv = require('dotenv');
const { envs } = require("./config/config");
// 解析命令行参数
const args = process.argv.slice(2);
let env;
if (args.length) {
    let cli = args.find(arg => /^--env=/.test(arg));
    if (cli) {
        env = envs.find(env => env === cli.split('=')[1]);
        if (!env) throw Error("命令行参数错误！");
    } else {
        throw Error("命令行写入方式错误！");
    }
} else {
    env = envs[0];
}
dotenv.config({ path: `./.env.${env}` });
console.log(`执行环境为${env}: ${process.env.QIUY_URL}`);