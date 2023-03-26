const groupMsgModel = require("../model/group_msg");

const io = require("./index").feed();
// 建立连接
io.on('connection', (socket) => {
    // 接收群消息
    socket.on("send-group-msg", async data => {

        if (!(data.message instanceof Object)) {
            const { message } = data;
            data.message = { default: message }
        }
        // 将接收到的群消息加入到数据表中
        const groupMsg = new groupMsgModel(data);
        groupMsg.save((err, docs) => {
            if (err) return res.cc(err);
            // console.log(docs);
            // 将消息内容广播到群成员中
            io.emit("accept-group-msg", docs);
        })
    })

});
