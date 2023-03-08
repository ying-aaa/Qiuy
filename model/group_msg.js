const mongoose = require("../db/index");
const Schema = mongoose.Schema;
const groupMsgSchema = mongoose.Schema({
    groupId: {
        type: Schema.Types.ObjectId,
    },
    sendId: {
        type: Schema.Types.ObjectId,
    },
    send_name: {
        type: String
    },
    message: {
        type: Object
    },
    types: {
        type: Number
    },
    send_time: {
        type: Number
    }
})

const groupMsgModel = mongoose.model("Group_msg", groupMsgSchema, "group_msg");
module.exports = groupMsgModel;