const friendsModel = require("../model/friedns");
const friendMsgModel = require("../model/friend_msg");
const io = require("./index").feed();
// 在线人数列表
let onlineUser = [];
// 建立连接
io.on('connection', (socket) => {
    // 用户上线的接口
    socket.on("pop-up-online", (userInfo) => {
        // 存储当前在线用户
        const is = onlineUser.find(item => item._id === userInfo._id);
        const index = onlineUser.findIndex(item => item._id === userInfo._id);
        if (is) {
            onlineUser.splice(index, 1, userInfo);
            return;
        }

        onlineUser.push(userInfo)
        // console.log("在线用户", is, index);
    })


    // 接收一对一用户消息
    socket.on("send-msg", (data) => {
        console.log("用户发来的消息", data);




        if (!(data.message instanceof Object)) {
            const { message } = data;
            data.message = { default: message }
        }

        console.log("&&&&&&&&&&&&&&&", data);
        // 将新发送的消息提交给后端
        const msg = new friendMsgModel(data);
        msg.save((err, docs) => {
            if (err) return err;
            // 让接收者的未读消息+1
            const where = { userId: data.acceptId, friendId: data.sendId };
            friendsModel.updateOne(where, { $inc: { tip: 1 } }).exec((err, docs) => {
                if (err) return console.log(err);
                console.log("增加了未读消息数量");
            })
            // 查找在线用户中与接收消息者 ID 相同的用户
            // const currentAcceptUser = onlineUser.find(user => user._id === data.acceptId);
            // // 消息上传成功后再返回给前端
            // if (currentAcceptUser) {
            io.emit("accept-msg", docs);
            // }
        })
    })

    // 清空用户消息
    socket.on("clear-tip", (where) => {
        console.log("清空用户的好友未读消息数");
        friendsModel.updateOne(where, { tip: 0 }).exec((err, docs) => {
            if (err) return console.log(err);
            console.log(where, docs);
            if (docs.modifiedCount !== 1) return console.log("清空未读消息数失败(修改的与原来的一样)");
        })
    })
})

