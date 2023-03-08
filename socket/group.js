const groupMsgModel = require("../model/group_msg");

const io = require("./index").feed();
// 建立连接
io.on('connection', (socket) => {
    console.log("连接上了aaaa");
    // 接收群消息
    socket.on("send-group-msg", async data => {


        console.log(data);
        if (!(data.message instanceof Object)) {
            const { message } = data;
            data.message = { default: message }
        }
        // 将接收到的群消息加入到数据表中
        const groupMsg = new groupMsgModel(data);
        groupMsg.save((err, docs) => {
            if (err) return res.cc(err);
            // console.log(docs);
            // 将消息内容广播到群成员中
            io.emit("accept-group-msg", docs);
        })
    })

});

var mongoose = require('mongoose');

// 开启缓存机制，如果上次查询没有发生变化，将会缓存查询结果 mongoose.set('useFindAndModify', false);

// 连接数据库 mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

// 定义一个 Model const Person = mongoose.model('Person', { name: String, age: Number });

// 查询一条记录 let person = await Person.findOne({ name: 'Jack' });

// 缓存机制中，一旦我们第一次查询数据库得到结果，这个结果就会被缓存起来，当我们再次查询的时候，会优先从缓存中获取结果，而不会再去查询数据库，从而提高查询的性能。









//发起数据库查询
// User.findOne({
//     name: 'Tom'
// },
//     function (err, user) {
//         if (err) {
//             console.log(err);
//         }

//         if (user) {
//             //如果缓存中已有该数据，从缓存中获取数据
//             cache.get('user', function (err, data) {
//                 if (err || !data) {
//                     //如果缓存中没有，就从数据库中获取
//                     data = user;
//                     //把获取的数据存入缓存中
//                     cache.set('user', data,
//                         function (err) {
//                             if (err) {
//                                 console.log(err);
//                             }
//                         });
//                 }
//                 console.log(data);
//             });
//         }
//     });