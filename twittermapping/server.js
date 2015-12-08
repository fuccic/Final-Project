// =============
// REQUIREMENTS
// =============
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    nodeDebugger = require('node-debugger'),
    md5 = require('md5'),
    cookieParser = require('cookie-parser'),
    httpServer = require('http-server'),
    twitter = require('twitter'),
    sentiment = require('sentiment'),
    env = require('dotenv').load();

var port = process.env.PORT || 3000;
var app = express();

var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// =============
// MIDDLEWARE
// =============
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));


app.use(cookieParser());

// =============
// DATABASE
// =============
mongoose.connect('mongodb://localhost/twittermapper');

// =============
// MODELS
// =============
var User = require('./models/user');

// =============
// LISTENER
// =============
app.listen(port);

// =============
// Search Get Request
// =============

// client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response){
//    console.log(tweets);
//    console.log(response);
// });
 
// client.get('favorites/list', function(error, tweets, response){
//   if(error) throw error;
//   console.log(tweets);  // The favorites. 
//   console.log(response);  // Raw response object. 
// });

app.get('/test', function(req, res){
	client.get('/search/tweets', {q: 'butts', count: 100}, function(error, tweets, response){
		res.send(tweets);
	});
})










