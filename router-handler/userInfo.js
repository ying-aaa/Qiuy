const usersModel = require("../model/users");
const bcrypt = require("bcryptjs");
const friendsModel = require("../model/friedns");
const groupMenberModel = require("../model/group_menber");
const { pathConvert } = require("../utils/util-multer");

// 获取用户信息
exports.getUserInfo = (req, res) => {
    // console.log(req.query);
    const { uid } = req.query;
    const { _id } = req.user;
    // const _id = req.user;
    const where = uid ? { _id: uid } : { _id };
    usersModel.find(where, { password: 0, __v: 0 }, async (err, docs) => {
        if (err) return res.cc(err);
        if (docs.length === 0) return res.cc("获取用户信息失败!(未查找到用户)");
        if (uid) {
            const where = { userId: _id, friendId: uid };
            const friend = await friendsModel.find(where);
            // 好友列表里有该用户且与该用户的好友状态为 0 则返回好友字段
            if (friend.length && (friend[0].status === 0)) docs[0]._doc.friend = friend[0];
        }
        res.send({
            status: 0,
            message: "获取用户信息成功!",
            data: docs[0]._doc
        })
    })
}
// 更新用户信息
exports.updateUserInfo = (req, res) => {
    const { _id } = req.user;
    const { username, nickname } = req.body;
    // console.log(req.body);
    if (username) return res.cc("不能修改账号");
    usersModel.find({ nickname }, (err, docs) => {
        if (err) return res.cc(err);
        if (docs.length !== 0 && docs[0]._id !== _id) return res.cc("该名字已存在，换一个试试吧！");
        // console.log("用户信息", req.body);
        // console.log("req.body", req.body);
        usersModel.updateOne({ _id }, { $set: req.body }, (err, docs) => {
            if (err) return res.cc(err);
            if (docs.modifiedCount !== 1) return res.cc("更新失败(更新后的信息与原来相同)");
            // console.log(docs);
            // res.cc("更新用户信息成功！", 0);

            usersModel.find({ _id }, { password: 0, __v: 0 }, (err, docs) => {
                if (err) return res.cc(err);
                // res.cc("更新用户信息成功！", 0);
                res.send({
                    status: 0,
                    message: "更新用户信息成功!",
                    data: docs[0]._doc
                })
            })
        });
    })
}

// 更新密码
exports.updatePwd = (req, res) => {
    const { _id } = req.user;
    // console.log(111, "******", req.body);
    usersModel.find({ _id }, (err, docs) => {
        if (err) return res.cc(err);
        if (docs.length === 0) return res.cc("无法修改(未查找到用户)");
        const { oldPwd, newPwd } = req.body;
        const compareResult = bcrypt.compareSync(oldPwd, docs[0]._doc.password);
        // console.log("compareResult", compareResult);
        if (!compareResult) return res.cc("原密码错误！");
        const password = bcrypt.hashSync(newPwd, 10);
        usersModel.update({ _id }, { $set: { password } }, (err2, docs2) => {
            if (err) return res.cc(err);
            // console.log(docs2);
            if (docs2.modifiedCount !== 1) return res.cc("更新失败(更新后的密码与原来相同)");
            res.cc("密码更新成功！", 0);
        })
    })
}

// 更新用户头像
exports.updateAvater = (req, res) => {
    const { _id } = req.user;
    usersModel.findOne({ _id }, (err, docs) => {
        if (err) return res.cc(err);
        if (docs.length === 0) return res.cc("无法修改(未查找到用户)");
        const user_avater = pathConvert(req.file.path);
        usersModel.findByIdAndUpdate({ _id }, { $set: { user_avater } }, { returnDocument: "after" }, (err2, docs2) => {
            if (err2) return res.cc(err2);
            // 修改好友表和群表中关于自己的头像
            friendsModel.updateMany({ friendId: _id }, { $set: { friend_avater: user_avater } }, (err, docs) => {
                if (err) return res.cc(err);
            })
            groupMenberModel.updateMany({ menberId: _id }, { $set: { menber_avater: user_avater } }, (err, docs) => {
                if (err) return res.cc(err);
            })
            res.send({
                status: 0,
                message: "头像更新成功",
                data: docs2
            })
        })
    })
}