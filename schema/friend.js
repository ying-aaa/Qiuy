const joi = require("Joi");

const friendId = joi.string().required();
const friend_name = joi.string(); // .required()
const friend_sing = joi.string().required();
const friend_avater = joi.string().required();
const handler = joi.boolean().required();

exports.add_friend_schema = {
    body: {
        friendId,
        friend_name,
        friend_sing,
        friend_avater
    }
}
exports.handler_friend_schema = {
    body: {
        handler, friendId, friend_name
    }
}