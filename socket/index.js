const socketIo = require("socket.io");
let io;
module.exports = {
    register: (server) => {
        io = socketIo.listen(server);
    },
    feed: () => {
        return io;
    }
}