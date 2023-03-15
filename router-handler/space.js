const spaceModel = require("../model/space");
const friendsModel = require("../model/friedns");
const usersModel = require("../model/users");

// 用户发布动态 需要：用户id、内容文字、内容图片、点赞数量、评论数量
/*
*   content
*   image_urls
*/
exports.createSpace = async (req, res) => {
    const { _id } = req.user;
    const space = new spaceModel({
        ...req.body, userId: _id, create_time: Date.now()
    })
    try {
        const result = await space.save();
        res.send({
            status: 0,
            message: "发布动态成功！",
            data: result
        });
    } catch (error) {
        res.cc(error.message);
    }
}


// 获取动态列表 需要：用户ID，如果没有传入用户ID，则获取为自己+好友的
exports.gainSpace = async (req, res) => {
    try {
        const { userId } = req.body;
        if (userId) {
            const where = { userId };
            // sort -1 先返回最近的时间
            // .skip(10).limit(10) 从第10条开始向后查找10条，最开始的下标为0
            const space = await spaceModel.find(where).lean()
                .sort({ create_time: -1 })
                .skip(0)
                .limit(10).exec();
            const user = await space.find(where);
            console.log(user);
            space.forEach(s => {
                s.user_name = user[0].nickname;
                s.user_avater = user[0].user_avater;
            })
            res.send({
                status: 0,
                message: "获取个人动态列表成功",
                data: space
            });

        } else {
            const { _id, nickname, user_avater } = req.user;

            const friends = (await friendsModel.find({ userId: _id }).lean()
                .select({ friendId: 1, _id: 0, friend_name: 1, friend_avater: 1 })
                .exec())
            const friendIds = friends.map(friend => friend.friendId);
            const where = { userId: { $in: [...friendIds, _id] } }
            const space = await spaceModel.find(where).sort({ create_time: -1 }).lean()
                .skip(0)
                .limit(10).exec();
            friends.push({
                friendId: _id,
                friend_name: nickname,
                friend_avater: user_avater
            })
            console.log(space);
            space.forEach(s => {
                friends.forEach(f => {
                    if (String(s.userId) == String(f.friendId)) {
                        console.log(1111);
                        s.user_name = f.friend_name;
                        s.user_avater = f.friend_avater;
                    }
                })
            })
            res.send({
                status: 0,
                message: "获取动态聊表成功！",
                data: space
            })
        }
    } catch (error) {
        res.cc(error.message);
    }
}

