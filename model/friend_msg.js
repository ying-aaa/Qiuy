const mongoose = require("../db/index");
const Schema = mongoose.Schema;
const friendMsgSchema = mongoose.Schema({
    sendId: {
        type: Schema.Types.ObjectId,
    },
    acceptId: {
        type: Schema.Types.ObjectId,
    },
    message: {
        type: Object
    },
    types: {
        type: Number
    },
    send_time: {
        type: Number
    },
    status: { // 读取状态
        type: Number
    }
})

const friendMsgModel = mongoose.model("Friend_msg", friendMsgSchema, "friend_msg");
module.exports = friendMsgModel;