var express = require('express');
var router = express.Router();

var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

//form express4, upload multipart(img), use bellow
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.get('/', function(req, res, next) {
	Photo.find({}, function(err, photos){
		if (err) return next(err);
		res.render('photos', {
		title: 'Photos',
		photos: photos
		});
		});

});


router.get('/upload', function(req, res) {
	res.render('upload', {
		title: 'Photo upload'
	});


});


router.post('/upload', multipartMiddleware, function(req, res, next) {
var img = req.files.photo.image;
var name = req.body.photo.name || img.name;
var path = join(global.photosDir, img.name);

var is = fs.createReadStream(img.path);
var os = fs.createWriteStream(path);

is.pipe(os);
is.on('end',function() {
    fs.unlinkSync(img.path);
    Photo.create({
	name: name,
	path: img.name
	}, function (err) {
	if (err) return next(err);
	res.redirect('/photos');
	});
});
// fs.rename(img.path, path, function(err){
// if (err) return next(err);
// Photo.create({
// name: name,
// path: img.name
// }, function (err) {
// if (err) return next(err);
// res.redirect('/photos');
// });
// });

});

module.exports = router;
