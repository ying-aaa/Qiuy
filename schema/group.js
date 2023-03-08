const joi = require("Joi");

const ownerId = joi.string().required();
const group_name = joi.string().required();
const menbers = joi.array();
exports.create_group_schema = {
    body: {
        // ownerId,
        group_name,
        menbers
    }
}