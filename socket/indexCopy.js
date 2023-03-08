const {
    Server
} = require("socket.io");
let io;
module.exports = {
    register: (server) => {
        io = new Server(server, {
            cors: {
                origin: "*", // http://localhost:5173
            },
            allowEIO3: true,
        });

    },
    feed: () => {
        return io;
    }
}