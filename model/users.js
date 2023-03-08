// const mongooses = require("mongoose")
const mongoose = require("../db/index");
// const Schema = mongoose.Schema;

const usersSchema = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    nickname: {
        type: String
    },
    email: {
        type: String
    },
    sex: {
        type: String
    },
    birthday: {
        type: String
    },
    phone: {
        type: Number
    },
    create_time: {
        type: Number
    },
    sing: {
        type: String
    },
    user_avater: {
        type: String
    }
})

const usersModel = mongoose.model("Users", usersSchema, "users");
module.exports = usersModel;