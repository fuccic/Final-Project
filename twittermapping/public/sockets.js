// =============
// Sockets Twitter 
// =============
var socket = io();



    socket.on('twitter-stream', function(tweet) {

    //only selects tweets with coordinates
    console.log(tweet);
        
    });

