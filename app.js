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

function init() {
	fetchData();
	setInterval(fetchData, 86400000);
}


init();