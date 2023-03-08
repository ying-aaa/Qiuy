const mongoose = require("../db/index");
const Schema = mongoose.Schema;
const groupsSchema = mongoose.Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
    },
    group_name: {
        type: String
    },
    group_avater: {
        type: String
    },
    group_cover: {
        type: String
    },
    group_sing: {
        type: String
    },
    create_time: {
        type: Number
    }
})

const groupsModel = mongoose.model("Groups", groupsSchema, "groups");
module.exports = groupsModel;