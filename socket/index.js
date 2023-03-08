// const socketIo = require("socket.io");
let io;
module.exports = {
    register: (server) => {
        io = require("socket.io").listen(server);
    },
    feed: () => {
        return io;
    }
}