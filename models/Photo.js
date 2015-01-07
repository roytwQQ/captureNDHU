var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/photo_app');
mongoose.connect('mongodb://fuckyou:shit@dogen.mongohq.com:10002/app31802368');

var schema = new mongoose.Schema({
	name: String,
	latitude: String,
	longitude: String,
	path: String,
	owner: String,
	date: String,
	title: String,
	camera: String,
	comment: String
});

module.exports = mongoose.model('Photo', schema);
