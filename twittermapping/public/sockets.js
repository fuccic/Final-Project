// =============
// Sockets Twitter 
// =============
var socket = io();

var locationsArray = [];
// console.log(locationsArray);

$(document).on('click', '#start-stream', function(){
	console.log('start-stream');

	socket.emit('activate', 'activate');

	    socket.on('twitter-stream', function(tweet) {

	    //only selects tweets with coordinates
		    locationsArray = [];
	        var coolShit = tweet;
	        locationsArray.push(coolShit);
	        console.log(locationsArray[0].lng);
		});
})

$(document).on('click', '#stop-stream', function() {

	console.log('stop');
	
	socket.emit('deactivate', 'deactivate');
});


