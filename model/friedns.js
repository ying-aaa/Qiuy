const mongoose = require("../db/index");
const Schema = mongoose.Schema;
const friendsSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
    },
    friendId: {
        type: Schema.Types.ObjectId,
    },
    friend_name: {
        type: String,
    },
    friend_avater: {
        type: String,
    },
    friend_sing: {
        type: String
    },
    generate_time: {
        type: Number
    },
    // 未读消息数量
    tip: {
        type: Number
    },
    status: {
        type: Number
    }
})

const friendsModel = mongoose.model("Friends", friendsSchema, "friends");
module.exports = friendsModel;