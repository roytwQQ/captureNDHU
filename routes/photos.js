var express = require('express');
var router = express.Router();

var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var request = require('request');
var async = require('async');
var join = path.join;

//form express4, upload multipart(img), use bellow
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.get('/', function(req, res, next) {
	// Photo.find({}, function(err, photos){
	// 	if (err) return next(err);
	// 	res.render('photos', {
	// 	title: 'Photos',
	// 	photos: photos
	// 	});
	// 	});


Photo.find()
.sort({'_id': -1})
.exec(function(err, photos) {
    // code here
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

router.get('/ranking', function(req, res) {

	Photo.find()
	.sort({'_id': -1})
	.exec(function(err, photos) {
	    // code here
	    if (err) return next(err);

	    // console.log('shit');
	    // console.log(photos._id);
	    var count5 = [];
	    var newData = [];

	    



	    async.series([
		    function(callback){
		    	async.each(photos, function(photo, callback2) {

		  // Perform operation on file here.
		  // console.log('Processing file ' + photo);
		  request('https://graph.facebook.com/fql?q=select%20%20like_count%20from%20link_stat%20where%20url="http://young-forest-9275.herokuapp.com/photos/'+photo._id+'"', function (error, response, body) {
					  if (!error && response.statusCode == 200) {
					  	// console.log(photo._id);
					  	count5.push(JSON.parse(body).data[0].like_count);
					  	count5.sort();
					  	count5.reverse();
					  	count5 = count5.slice(0,5);
					  	for(var i = 0;i<5;i++){
					  		newData[i] = photo;
					  	}
					    // console.log(JSON.parse(body).data[0].like_count); // Print the google web page。
					    callback2();
					  }else{
					  	console.log(body);
					  }
					});
		   
		    
		  
		}, function(err){
		    // if any of the file processing produced an error, err would equal that error
		    if( err ) {
		      // One of the iterations produced an error.
		      // All processing will now stop.
		      // console.log('A file failed to process');
		    } else {
		    	console.log(count5);
		      // console.log('All files have been processed successfully');
		      callback();

		    }
		});

		    		
		    },
		    function(callback){
		        // do some more stuff ...
		        // console.log("b");
		        callback();
		    }
		],
		// optional callback
		function(err, results){

			res.render('ranking', {
			title: 'ranking',
			newData: newData,
			count5: count5
			});
			
		    // results is now equal to ['one', 'two']
		});



	    

	    

			
	});


	
});


router.post('/upload', multipartMiddleware, function(req, res, next) {

var longitude = req.body.photo.longitude;
var latitude = req.body.photo.latitude;
var owner = req.body.photo.owner;
var title = req.body.photo.title;
var date = req.body.photo.date;
var camera = req.body.photo.camera;
var comment = req.body.photo.comment;



var img = req.files.photo.image;
var name = req.body.photo.name || img.name;
var nowTime = (new Date().getTime());
var path = join(global.photosDir, nowTime+img.name);

var is = fs.createReadStream(img.path);
var os = fs.createWriteStream(path);

is.pipe(os);
is.on('end',function() {
    fs.unlinkSync(img.path);
    Photo.create({
	name: name,
	longitude: longitude,
	latitude: latitude,
	path: nowTime+img.name,
	owner:owner,
	title: title,
	camera: camera,
	comment: comment,
	date: date
	}, function (err) {
	if (err) return next(err);
	res.redirect('/photos');
	});
});
/*-----------------------------*/

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

/*---------------------------------*/

});

module.exports = router;
