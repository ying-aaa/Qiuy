// 连接数据库
// const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);
// mongoose.connect("mongodb://localhost:27017/qiuy", {
// 	useNewUrlParser: true
// }, err => {
// 	if (err) return console.log("数据库连接失败");
// 	console.log("数据库连接成功");
// });
// module.exports = mongoose;

// const mongoose = require('mongoose');
// const uri = "mongodb+srv://qiuy:@qiuy.f2ry03c.mongodb.net/?retryWrites=true&w=majority";
// mongoose.connect(uri, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
// 	// we're connected! 
// 	const deviceSchema = new mongoose.Schema({
// 		name: String,
// 		type: String
// 	});
// 	const Device = mongoose.model('Device', deviceSchema);
// 	const device = new Device({
// 		name: 'qiuy',
// 		type: 'phone'
// 	});
// 	device.save(function(err, device) {
// 		if (err) return console.error(err);
// 		console.log(device.name + " saved to devices collection.");
// 	});
// });
// module.exports = mongoose;



const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const uri = "mongodb+srv://qiuy:ZHANGli040905@qiuy.f2ry03c.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, err => {
	console.log(err);
	if (err) return console.log("数据库连接失败");
	console.log(
		"数据库连接成功");
	// we're connected! 
	const deviceSchema = new mongoose.Schema({
		name: String,
		type: String
	});
	const Device = mongoose.model('Device', deviceSchema);
	const device = new Device({
		name: 'qiuy',
		type: 'phone'
	});
	device.save(function (err, device) {
		if (err) return console.error(err);
		console.log(device.name + " saved to devices collection.");
	});
});
module.exports = mongoose;