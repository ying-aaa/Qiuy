const { default: mongoose } = require("mongoose");
const groupsModel = require("../model/group");
const groupMenberModel = require("../model/group_menber");
const groupMsgModel = require("../model/group_msg");
const { pathConvert } = require("@/utils/util-multer");

// 建群需要 建群者ID，群名，群封面连接，群公告，群建立时间, 群成员信息(是个数组， 记录每个群成员的名字和头像)
exports.createGroup = (req, res) => {
    const { _id } = req.user;
    // if (!req.body.menbers.some(id => _id === id)) req.body.menbers.push(_id);
    const { group_name, menbers } = req.body;
    const create_time = Date.now();
    const group = new groupsModel({
        ownerId: _id,
        group_name,
        create_time,
        group_sing: "",
        group_cover: ""
    })
    console.log("群", menbers);
    group.save((err, docs) => {
        if (err) return res.cc(err);
        if (!docs) return res.cc("建群失败！");
        const { _id } = docs;
        console.log("创建成功", menbers);
        menbers.forEach(member => {
            const group_user = new groupMenberModel({
                groupId: _id,
                ...member,
                tip: 0,
                shield: 0, // 是否屏蔽消息
                enter_group_time: create_time,
            })
            group_user.save((err, docs) => {
                if (err) return res.cc(err);
                console.log("创建加入成员成功");
            })
        });
        res.cc("创建群聊成功！");
    })
}

// 获取用户加入的群聊
exports.JoinGroup = (req, res) => {
    const { _id } = req.user;
    groupMenberModel.aggregate([
        {
            $lookup: {
                from: "groups", // 查询的表
                localField: "groupId", // 表中查询用的值
                foreignField: "_id", // 用搜索的人的 id 查找谁的好友里有这个人
                as: "groups"
            }
        },
        {
            $lookup: {
                from: "group_msg", // 查询的表
                localField: "groupId", // 表中查询用的值
                foreignField: "groupId", // 用搜索的人的 id 查找谁的好友里有这个人
                as: "group_last_msg"
            }
        },
        { $match: { menberId: mongoose.Types.ObjectId(_id) } },
    ], (err, docs) => {
        if (err) return err;
        // console.log(docs);
        const data = docs.map(item => {
            item.groups[0].tip = item.tip;
            item.groups[0].group_last_msg = item.group_last_msg.length && item.group_last_msg.reduce((pre, cur) => pre.send_time > cur.send_time ? pre : cur);
            return item.groups[0]
        });
        res.send({
            status: 0,
            message: "获取用户相关群聊成功！",
            data
        })
    })
}

// 获取群聊消息 需要：群ID
exports.groupChat = (req, res) => {
    const { groupId } = req.query;
    groupMsgModel.find({ groupId }, (err, docs) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: "获取群聊消息成功！",
            data: docs
        });
    })
}


// 获取群聊内所有成员 需要：群ID
exports.groupMenber = (req, res) => {
    const { groupId } = req.query;
    groupMenberModel.find({ groupId }, (err, docs) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: "获取群聊成员信息成功！",
            data: docs
        });
    })
}




// 修改群信息 需要 - 群ID, 群名，群封面连接，群公告，群建立时间,
exports.groupInfo = (req, res) => {
    console.log("修改群信息");
    const { _id } = req.user;
    const body = req.body;
    const { body: { groupId } } = req;
    console.log(groupId);
    const where = { groupId };
    const update = { $set: body };
    groupsModel.update(where, update, (err, docs) => {
        if (err) return res.cc(err);
        console.log(docs);
        if (docs.modifiedCount === 0) return res.cc("修改信息失败！");
        res.cc("修改群聊信息成功！", 0);
    })
}
// 修改群内名称 需要 groupId, userId, username(修改后的名字)
exports.interiorName = (req, res) => {
    const { _id } = req.user;
    const { groupId, username } = req.body;
    const where = { groupId, userId: _id };
    const update = { $set: { username } };
    groupMenberModel.update(where, update, (err, docs) => {
        if (err) return res.cc(err);
        if (docs.modifiedCount === 0) return res.cc("修改群内昵称失败！");
        res.cc("修改群内昵称成功！", 0);
    })
}




// 设置群成员在群中的展示内容 - 需要：groupId, menber, 修改的字段以及值
exports.handlerMenber = (req, res) => {
    const where = { menberId: req.user._id, groupId: req.body.groupId };
    Reflect.deleteProperty(req.body, "groupId");
    groupMenberModel.updateOne(where, { $set: req.body }, async (err, docs) => {
        if (err) return res.cc(err);
        if (docs.modifiedCount !== 1) return res.cc("修改了个寂寞！");

        const data = await groupMenberModel.findOne(where);
        console.log(data);
        res.send({
            status: 0,
            message: "更新群内信息成功！",
            data
        })
    });


    // console.log("屏蔽群消息");
    // const { _id } = req.user;
    // const { groupId, shield } = req.body;
    // const where = { groupId, userId: _id };
    // const update = { shield };
    // // const
    // groupMenberModel.update(where, update, (err, docs) => {
    //     if (err) return res.cc(err);
    //     if (docs.modifiedCount === 0) return res.cc("消息屏蔽操作失败！");
    //     if (shield === "1") return res.cc("已开启群消息屏蔽模式！", 0);
    //     res.cc("已关闭群消息屏蔽模式！", 0);
    // })
}


// 更新群头像 需要：groupId
exports.groupAvater = (req, res) => {
    console.log(console.log("qqqqqqqqqq************************"));
    const group_avater = pathConvert(req.file.path);
    const where = { _id: req.body.groupId };
    groupsModel.updateOne(where, { $set: { group_avater } }, (err, docs) => {
        if (err) return res.cc(err);
        if (docs.modifiedCount !== 1) return res.cc("更新头像失败(修改的与原来的一样)");

        res.send({
            status: 0,
            message: "群聊头像更新成功！",
            data: { group_avater }
        })
    })
}

// 限群主修改群信息 需要：groupId 修改的字段以及值
exports.handlerGroup = (req, res) => {
    const where = { _id: req.body.groupId };
    Reflect.deleteProperty(req.body, "groupId");

    groupsModel.findByIdAndUpdate(where, { $set: req.body }, { returnDocument: "after" }, (err, docs) => {
        if (err) return res.cc(err);
        console.log("11111******", docs);
        res.send({
            status: 0,
            message: "更新群信息成功！",
            data: docs
        })
    });
}