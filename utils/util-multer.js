require('module-alias/register');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("file", file);
        cb(null, "./public/" + req.body.storageSeat);
    },
    filename: function (req, file, cb) {
        console.log("file", file);
        cb(null, "qiuy_" + Math.random().toString(36).slice(2) + "_" + Date.now() + "." + file.mimetype.split("/").at(-1));
    }
})
module.exports = {
    upload: multer({ storage })
}