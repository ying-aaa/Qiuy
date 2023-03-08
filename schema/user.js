const joi = require("joi");

// 用户名与密码的校验规则
const username = joi.string().min(6).max(10);
const password = joi.string().pattern(/^[\S]{6,12}$/);
const nickname = joi.string().min(1).max(20);
const sex = joi.number();
// const email = joi.string().pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const email = joi.string()
const birthday = joi.string();
// const phone = joi.string().pattern(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/);
const phone = joi.number();
const create_time = joi.date();
const sing = joi.string();
// 定义对于 用户头像 的验证规则
const user_avater = joi.string(); // .dataUri()


exports.reg_login_schema = {
	body: {
		username: username.required(),
		password: password.required(),
		email
	}
}
exports.update_nickname_schema = {
	body: {
		nickname,
		sex,
		email,
		birthday,
		phone,
		create_time,
		sing,
		user_avater
	}
}
exports.update_password_schema = {
	body: {
		oldPwd: password,
		newPwd: joi.not(joi.ref("oldPwd")).concat(password)
	}
}
exports.update_avatar_schems = {
	body: {
		user_avater
	}
}
