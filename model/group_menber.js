const mongoose = require("../db/index");
const Schema = mongoose.Schema;
const groupMenberSchema = mongoose.Schema({
    groupId: {
        type: Schema.Types.ObjectId,
    },
    menberId: {
        type: Schema.Types.ObjectId,
    },
    menber_name: {
        type: String
    },
    menber_avater: {
        type: String
    },
    tip: { // 未读消息数
        type: Number
    },
    shield: { // 屏蔽消息，0 不屏蔽， 1 屏蔽
        type: Number
    },
    username: {
        type: String
    }
})

const groupMenberModel = mongoose.model("Group_menber", groupMenberSchema, "group_menber");
module.exports = groupMenberModel;