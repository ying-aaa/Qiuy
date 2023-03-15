const mongoose = require("../db/index");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    userId: Schema.Types.ObjectId,
    spaceId: Schema.Types.ObjectId,
    content: String,
    create_time: {
        type: Number,
        default: Date.now()
    }
})

const commentModel = mongoose.model("Comment", commentSchema, "comment");
module.exports = commentModel;