const io = require("./index").feed();
// 建立连接
io.on('connection', (socket) => {
    socket.on("add-friend", (id) => {
        io.emit("add-friend", id);
    })
});