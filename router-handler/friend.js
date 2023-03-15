const friendsModel = require("../model/friedns");
const friendMsgModel = require("../model/friend_msg");
const mongoose = require("mongoose");
function addFriend_sehcma(_id, friendId, friend_name, friend_sing, friend_avater, generate_time, status = 2) {
    return new friendsModel({
        userId: mongoose.Types.ObjectId(_id),
        friendId: mongoose.Types.ObjectId(friendId),
        friend_name,
        friend_sing,
        friend_avater,
        generate_time,
        tip: 0,
        status
    })
}

// 申请添加好友的接口 需要: 加的好友的id 添加好友的备注，添加介绍，好友头像
exports.addFriend = (req, res) => {
    const { _id, user_avater, nickname } = req.user;
    const { friendId, friend_name, friend_sing, friend_avater } = req.body;
    // console.log("nickname", req.user);
    // console.log("friend_name", friend_name);
    const generate_time = Date.now();
    const where = { $or: [{ userId: _id, friendId }, { friendId: _id, userId: friendId }] };
    if (_id === friendId) return res.cc("滚，不能添加自己为好友！");
    friendsModel.find(where, (err, docs) => {
        if (err) return err;
        if (docs.length === 2) return res.cc("已申请添加好友！", 0);
        // 添加好友方
        const friend = addFriend_sehcma(_id, friendId, friend_name, friend_sing, friend_avater, generate_time, 2);
        // 被添加方
        const user = addFriend_sehcma(friendId, _id, nickname, friend_sing, user_avater, generate_time, 1);
        friend.save((err, docs) => {
            if (err) return res.cc(err);
            user.save((err) => {
                if (err) return res.cc(err);
                res.cc("好友申请成功", 0);
            })
        })
    })
}
// 查看自己 发出好友申请 和 接收到的好友申请 的接口 
// 0: 查看所有好友 1：接收到的好友申请 2：发出好友申请 0: 查看所有好友
function aggregate(where, a, b) {
    return [
        {
            $lookup: {
                from: 'friend_msg',
                let: {
                    userId: '$userId', friendId: '$friendId'
                },
                pipeline: [{
                    $match: {
                        $and: [{
                            $expr: {
                                $eq: ['$sendId', a]
                            }
                        }, {
                            $expr: {
                                $eq: ['$acceptId', b]
                            }
                        },],
                    },
                },],
                as: 'friend_msg',
            },
        },
        { $match: where },

    ]
}
exports.lookFriend = (req, res) => {
    const { _id } = req.user;
    const { type } = req.query;
    const arr = [0, 1, 2];
    // 如果传入的数值不是 0，1，2 则返回错误
    if (!arr.some(val => type == val)) return res.cc("参数无效！");
    // 需要 userId
    const where = { userId: mongoose.Types.ObjectId(_id), status: Number(type) };
    // 如果状态为 0 , 则说明已经是好友，那么再返回信息的时候需要顺带返回聊天时间
    if (type == 0) {
        friendsModel.aggregate(aggregate(where, '$$userId', '$$friendId')).exec((err, userMsg) => {
            if (err) return res.cc(err);
            friendsModel.aggregate(aggregate(where, '$$friendId', '$$userId')).exec((err, friendMsg) => {
                if (err) return res.cc(err);
                // console.log(friendMsg);
                userMsg.forEach((user, key) => {
                    user.friend_msg = user.friend_msg.concat(friendMsg.at(key).friend_msg);
                    user.friend_msg = user.friend_msg.sort((a, b) => b.send_time - a.send_time)?.at(0);
                })
                res.send({
                    message: "获取好友列表成功！",
                    status: 0,
                    data: userMsg
                })
            })
        })
        return;
    }
    friendsModel.find(where, (err, docs) => {
        if (err) return res.cc(err);
        res.send({
            message: "获取好友列表成功！",
            status: 0,
            data: docs
        })
    })
}


// 同意好友申请的接口
exports.handlerFriend = (req, res) => {
    // 需要 handler, userId, friendId, friend_name
    console.log(111, "别请求了");

    const { _id } = req.user;
    const { handler, friendId, friend_name } = req.body;
    const where = { $or: [{ userId: _id, friendId }, { userId: friendId, friendId: _id }] }
    if (!handler) {
        friendsModel.remove(where, (err, docs) => {
            if (err) return res.cc(err);
            if (docs.deletedCount !== 2) return res.cc("拒绝了不存在的好友申请！");
            res.cc("已拒绝对方的好友申请！", 0);
        });
        return;
    }
    const out = { $set: { status: 0 } }
    friendsModel.update(where, out, (err, docs) => {
        if (err) return res.cc(err);
        if (docs.modifiedCount !== 2) return res.cc("同意不存在的好友申请！");
        res.cc("已同意对方的好友申请！", 0);

        // 如果重新设置备注名字
        // friendsModel.update({ userId: _id, friendId }, { $set: { friend_name } }, (err, docs) => {
        //     if (err) return res.cc(err);
        //     res.cc("已同意对方的好友申请！", 0);
        // })
    })
}

// 删除好友的接口 需要 -- 好友 id
exports.deleteFriend = (req, res) => {
    const { _id } = req.user;
    const { friendId } = req.query;
    const where = { userId: _id, friendId };
    friendsModel.remove(where, (err, docs) => {
        if (err) return res.cc(err);
        if (docs.deletedCount !== 1) return res.cc("删除了不存在的好友！");
        res.cc("已删除好友!", 0);
    });
}





// 修改好友备注 需要 friendId friend_name
exports.friendCall = (req, res) => {
    const { _id } = req.user;
    const { friendId, friend_name } = req.body;
    if (!(friendId && friend_name)) return res.cc("参数无效！");
    const where = { userId: _id, friendId };
    const out = { $set: { friend_name } }
    friendsModel.findOneAndUpdate(where, out, { returnDocument: "after" }, (err, docs) => {
        if (err) return res.cc(err);
        // if (docs.modifiedCount !== 1) return res.cc("修改的名字与原来一样！");
        console.log(docs);
        // res.cc("修改成功！", 0);
        res.send({
            message: "修改好友备注成功！",
            status: 0,
            data: docs
        })
    })
}


exports.clearTip = (req, res) => {
    res.send("清除成功");
    const where = { userId: req.body.userId, friendId: req.body.friendId };

    friendsModel.update(where, { tip: 0 }).exec((err, docs) => {
        if (err) return console.log(err);
        // console.log(where, docs);
        if (docs.modifiedCount !== 1) return console.log("清空未读消息数失败(修改的与原来的一样)");
    })
}