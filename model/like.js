const mongoose = require("../db/index");
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
    userId: Schema.Types.ObjectId,
    spaceId: Schema.Types.ObjectId,
    create_time: {
        type: Number,
        default: Date.now()
    }
})

const likeModel = mongoose.model("Like", likeSchema, "like");
module.exports = likeModel;