const usersModel = require("../model/users");
const friendsMode = require("../model/friedns");
const mongoose = require("mongoose");

// 搜索用户或群聊的接口
exports.searchUser = (req, res) => {
    const { use } = req.query;
    const { _id } = req.user;
    const where = { $or: [{ "nickname": { $regex: use } }, { "email": { $regex: use } }] };
    const out = { "nickname": 1, "email": 1, "user_avater": 1, "_id": 1, items: 1 };
    if (!use) return res.cc("请传递参数！");
    usersModel.aggregate([
        {
            $lookup: {
                from: "friends", // 查询的表
                localField: "_id", // 表中查询用的值
                foreignField: "friendId", // 用搜索的人的 id 查找谁的好友里有这个人
                as: "items"
            }
        },
        { $match: where },
        { $project: out }
    ], function (err, docs) {
        console.log("docs", docs);
        console.log("err&&&&&&&&&&", !!err);
        if (err) return res.cc(err); // 请传递参数
        console.log(9999);
        docs.forEach(doc => {
            const { items } = doc;
            // 这里如果搜索的是自己的好友，因为可以直接跳转到两人的聊天页面，而两人的聊天页又需要两人对应的好友表
            doc.isFriend = items.some(item => String(item.userId) === _id && item.status === 0) ? true : false;
            console.log(doc.isFriend);
            if (!doc.isFriend) Reflect.deleteProperty(doc, "items");
        });
        console.log("docs", docs);
        res.send({
            status: 0,
            count: docs.length,
            data: docs
        })
    })

}
