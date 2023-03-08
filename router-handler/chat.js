const friendMsgModel = require("../model/friend_msg");

// 获取双人一对一聊天的消息表 需要 聊天的那个朋友的 id
exports.getUserChat = (req, res) => {
    const { _id } = req.user;
    const { friendId } = req.query;
    console.log(_id, friendId);
    const where = { $or: [{ sendId: _id, acceptId: friendId }, { acceptId: _id, sendId: friendId }] };
    friendMsgModel.find(where, (err, docs) => {
        if (err) return err;
        res.send({
            status: 0,
            message: "获取用户一对一消息成功",
            data: docs
        })
    })
}
