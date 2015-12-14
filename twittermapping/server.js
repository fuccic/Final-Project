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
app.get('/test', function(req, res){
	client.post('/statuses/filter', {q: 'cat', count: 1}, function(error, tweets, response){
    var namesArray = [];
    console.log(tweets);
		for (var i = 0; i < tweets.statuses.length; i++) {
      namesArray.push(tweets.statuses[i].text);
    };
    var r1 = sentiment(namesArray[0]);
    namesArray.push(r1.score); 
    res.send(namesArray);

	});
})


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

io.on('connection', function(socket) {
  console.log("your mom")
  socket.on('activate', function(input) { 
    console.log("socket on")
    client.stream('statuses/filter', { locations:'-180,-90,180,90' }, function(s) {
      stream = s;
      stream.on('data', function(data) {
              // Does the JSON result have coordinates
              // console.log(data.text)
        if (data.coordinates){
          if (data.coordinates !== null){
            //If so then build up some nice json and send out to web sockets
            var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};

            io.emit("twitter-stream", outputPoint);

            console.log(outputPoint);
            console.log(data.text);

            //Send out to web sockets channel.
            io.emit('twitter-stream', outputPoint);
          }
        }
      });
    });
  })
});


    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    // socket.emit("connected");
// });


