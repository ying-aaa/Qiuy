const multer = require('multer');
const { QIUY_URL } = process.env;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log("file", req.file);
        cb(null, "./public/" + req.body.storageSeat);
    },
    filename: function (req, file, cb) {
        // console.log("filename", req.file);
        cb(null, "qiuy_" + Math.random().toString(36).slice(2) + "_" + Date.now() + "." + file.mimetype.split("/").at(-1));
    }
})
module.exports = {
    upload: multer({ storage }),
    pathConvert: (filePath) => (`${QIUY_URL}\\${filePath}`).replace(/\\/g, "/")
}