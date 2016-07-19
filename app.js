if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}

var https = require('https'),fs = require('fs');
var AWS = require('aws-sdk');
var moment = require('moment');

var FIREBASE_URL = process.env.FIREBASE_DATABASE_URL
var FIREBASE_SECRET = process.env.FIREBASE_SECRET

function fetchData(){

	var url = FIREBASE_URL + '/.json?print=pretty&format=export&auth=' + FIREBASE_SECRET;

	var scoreReq = https.get(url, function (response) {
		var completeResponse = '';
		response.on('data', function (chunk) {
			completeResponse += chunk;
		});
		response.on('end', function() {
			console.log('Complete Response: ', completeResponse)
			saveToAWS(completeResponse);
		})
	}).on('error', function (e) {
		console.log('[ERROR] ' + momnet(now) + ' problem with request: ' + e.message);
	});

}


function saveToAWS(data) {
	var bucket_name = 'verre-firebase-backup';

	var folder_month = moment().format("MM - MMMM, YYYY");
	var folder_day = moment().format("MM-DD-YYYY - dddd");

	var filename_time = moment().format("h:mm:ss a - dddd, MMMM Do YYYY ");
	var static_name = '--- Verre_FB_Backup';
	var extension = '.json';
	var filename = filename_time + static_name + extension;
	
	var path = folder_month + '/' + folder_day + '/' + filename;

	var FBjsonStream = data;

	var s3bucket = new AWS.S3({params: {Bucket: bucket_name}});
	s3bucket.createBucket(function() {
	  var params = {
	        BucketName    : bucket_name,
	        Key    		  : path,
	        Body          : FBjsonStream
	    };
	  s3bucket.upload(params, function(err, data) {
	    if (err) {
	      console.log("Error uploading data: ", err);
	    } else {
	      console.log("[SUCCESS] Uploaded data to: ", path);
	    }
	  });
	});

}
// function getFileName(format){
//         return __dirname+'/backup/'+(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))+'.'+format;
// }

// function writeToFile(filename,data){
// 	fs.writeFile(filename, data, function(err) {
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			console.log("[SUCCESS] "+new Date()+" JSON saved to " + filename);
// 		}
// 	});
// }

function init() {
	fetchData();
	setInterval(fetchData, 86400000);
}


init();

        // ContentLength : file_info.size,

// var s3 = new AWS.S3();
// var params = {Bucket: 'myBucket', Key: 'myImageFile.jpg'};
// var file = require('fs').createWriteStream('/path/to/file.jpg');
// s3.getObject(params).createReadStream().pipe(file);

// var bucket_name = 'your-bucket name'; // AwsSum also has the API for this if you need to create the buckets

// var img_path = 'path_to_file';
// var filename = 'your_new_filename';

// // using stat to get the size to set contentLength
// fs.stat(img_path, function(err, file_info) {

//     var bodyStream = fs.createReadStream( img_path );

//     var params = {
//         BucketName    : bucket_name,
//         ObjectName    : filename,
//         ContentLength : file_info.size,
//         Body          : bodyStream
//     };

//     s3.putObject(params, function(err, data) {
//         if(err) //handle
//         var aws_url = 'https://s3.amazonaws.com/' + DEFAULT_BUCKET + '/' + filename;
//     });

// });


// var fmt = require('fmt');
// var amazonS3 = require('awssum-amazon-s3');

// var s3 = new amazonS3.S3({
//     'accessKeyId'     : process.env.ACCESS_KEY_ID,
//     'secretAccessKey' : process.env.SECRET_ACCESS_KEY,
//     'region'          : amazonS3.US_EAST_1
// });

// // you must run fs.stat to get the file size for the content-length header (s3 requires this)
// fs.stat(__filename, function(err, file_info) {
//     var bodyStream = fs.createReadStream( __filename );

//     var options = {
//         BucketName    : bucket,
//         ObjectName    : 'amazon.js',
//         ContentLength : file_info.size,
//         Body          : bodyStream
//     };

//     s3.PutObject(options, function(err, data) {
//         fmt.dump(err, 'err');
//         fmt.dump(data, 'data');
//     });
// });