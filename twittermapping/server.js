// =============
// REQUIREMENTS
// =============
require('dotenv').load();
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    nodeDebugger = require('node-debugger'),
    md5 = require('md5'),
    cookieParser = require('cookie-parser'),
    httpServer = require('http-server'),
    twitter = require('twitter'),
    sentiment = require('sentiment'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);


var port = process.env.PORT || 3000;


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
var Search = require('./models/search');

// =============
// LISTENER
// =============
http.listen(port);
// http.listen(process.env.PORT || 3000);

// =============
// Twitter API Search Get Request
// =============

// app.get('/search_test', function(req, res) {
//     client.get('search/tweets', {
//         geocode: '37.781157,-122.398720,24901mi', count: 1
//     }, function(error, tweets, response) {
//       var namesArray = [];
//       console.log(tweets.statuses)
//       for (var i = 0; i < tweets.statuses.length; i++) {
//         namesArray.push(tweets.statuses[i]);
//       };
//       // var r1 = sentiment(namesArray[0]);
//       // namesArray.push(r1.score); 
//       res.send(namesArray);
//     });
// })
// app.get('/test', function(req, res){
// 	client.post('/statuses/filter', {locations: '-180,-90,180,90'}, function(error, tweets, response){
//     var namesArray = [];
//     console.log(tweets);
// 		for (var i = 0; i < tweets.statuses.length; i++) {
//       namesArray.push(tweets.statuses[i].text);
//     };
//     var r1 = sentiment(namesArray[0]);
//     namesArray.push(r1.score); 
//     res.send(namesArray);

// 	});
// })



// =============
// User Login
// =============

app.get('/users', function(req, res){
  User.find().then(function(users){
    res.send(users);
  });
});



// =============
// Create User
// =============

app.post('/users', function(req, res){
  password_hash = md5(req.body.password_hash);
  username = req.body.username;
  var user2 = new User({
    password_hash: password_hash,
    username: username
  });
  // var user2 = {
  //   password_hash: password_hash,
  //   username: username
  // };
  User.findOne({'username' : username}).exec(function(err, user){
    console.log(user2);
    if (user != null && user.username === username) {
        console.log("Username is already taken!");
          }
    else{
      user2.save(function(err) {
        if (err){
          console.log(err);
          res.statusCode = 503;
        }else{
          // console.log(user.username + ' created!');
          //set the cookie!
          res.cookie("loggedinId", user2.id);
          res.send(user2);
        }; 
      }); 
    };
  });
});


// =============
// User Login
// =============
app.post('/users/login', function(req, res){
  console.log(req.body.username);
  var username = req.body.username;
  var password_hash = md5(req.body.password_hash);
  console.log(req.body.password_hash);

  // Mongoose query below find the user and compares the password hashed for authentication and sets the cookie. 
  User.findOne({'username' : username}).exec(function(err, user){
    // console.log(user);
    if (user != null && user.password_hash === password_hash) {
      console.log("success");
      res.cookie("loggedinId", user.id);
      res.send(user);
        }
    else{
      res.status(503).send();
    };
  });
});

// =============
// User Seed
// =============
// app.get('/seed', function(req, res){
//   var user = new User({
//     password_hash: "12345",
//     username: "Conor"
//   });

//   user.save(function(err) {
//     if (err){
//       console.log(err);
//       res.statusCode = 503;
//     }else{
//       // console.log(user.username + ' created!');
//       //set the cookie!
//       res.cookie("loggedinId", user.id);
//       res.send(user);
//       console.log('user id: ', user.id);
//     };  
//   });
// });

// =============
// Sockets Code
// =============
//Create web sockets connection.
// io.sockets.on('connection', function (socket) {

//   //Code to run when socket.io is setup.
//   socket.on("start tweets", function() {

//     if(stream === null) {
      //Connect to twitter stream passing in filter for entire world.

var streamOn = ""

var streamOff = function(input) {

  socket.removeListener('activate', streamOn);

}

// client.stream('statuses/filter', {track: 'Trump'}, function(stream) {
//   stream.on('data', function(tweet) {
//     console.log('OTHERS: ', tweet.text);
//   });
 
//   stream.on('error', function(error) {
//     console.log('The error, is: ', error);
//   });
// });




var startArray = [];




io.on('connection', function(socket) {

// twit.currentTwitStream = stream;
// This is only a suggestion. Perhaps you have a central configuration object which would be a better place for the current stream object. With currentTwitStream you can do this:

// currentTwitStream.readable is false after an error or close.
// currentTwitStream.destroy()
  
    console.log('a user connected');
    
    socket.on('activate', function(input) {
      console.log('From client (activate): ', input);

      console.log('current twit stream: ', client.currentClientStream);

      client.stream('statuses/filter', { locations: '-180,-90,180,90' }, function(s) {
            stream = s;
            stream.on('data', function(data) {
              
                // Does the JSON result have coordinates
                
                if (data.coordinates){
                  if (data.coordinates !== null && data.place!== null){
                    //If so then build up some nice json and send out to web sockets
                    // console.log(data);
                    var outputPoint = {"lat": data.coordinates.coordinates[1],"lng": data.coordinates.coordinates[0]};
                    startArray.push(outputPoint);
                    var tweetText = data.text;
                    var tweetLocation = data.place.country;
                    // console.log(tweetLocation);
                    var newOutput = [outputPoint, tweetText, tweetLocation];
                    // console.log('Start Array! :)    ->', startArray);
                    // io.emit("twitter-stream", outputPoint);
                    console.log(newOutput);
                    // console.log(outputPoint);
                    console.log(startArray.length);
                    // console.log(data.text);
                    // console.log(data.text);

                    //Send out to web sockets channel.
                    io.emit('twitter-stream', newOutput);
                  }
                }
                // if (startArray.length > 300) { 
            
                //   stream.destroy();
                //   console.log('DESTROYyed>');
                //   console.log('IF! AFTER THE END', outputPoint);
                //   // console.log('AFTER THE END', outputPoint);
                //   // console.log('AFTER THE END', outputPoint);

                // };//end of if statement

                socket.on('deactivate', function(yes) {

                  // console.log('Stream: ', stream);
                  stream.destroy();
                  console.log('DESTROYyed> by butn');
                  console.log('BUTTON! AFTER THE END', outputPoint);
                  // console.log('BUTTON! AFTER THE END', outputPoint);
                  console.log('It is the length: ', startArray.length);
                });

            }); // end stream

        }); // end client stream

  });
    // socket.on('deactivate', streamOff);
        
});//end of sockets



    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    // socket.emit("connected");
// });


