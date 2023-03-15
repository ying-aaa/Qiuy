
const mongoose = require("../db/index");
const Schema = mongoose.Schema;

const spaceSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
    content: String,
    image_urls: Array,
    create_time: {
        type: Number,
        default: Date.now()
    },
    like_count: {
        type: Number,
        default: 0
    },
    comment_count: {
        type: Number,
        default: 0
    }
})
const spaceModel = mongoose.model("Space", spaceSchema, "space");
module.exports = spaceModel;