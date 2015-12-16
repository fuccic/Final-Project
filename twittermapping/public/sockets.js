// =============
// Sockets Twitter 
// =============
var socket = io();

var locationsArray = [];
var textArray = [];
var citiesArray = [];
// console.log(locationsArray);

$(document).on('click', '#start-stream', function(){
	console.log('start-stream');

	socket.emit('activate', 'activate');

	    socket.on('twitter-stream', function(tweet) {

	    //only selects tweets with coordinates
		    locationsArray = [];
	        var coolShit = tweet;
	        locationsArray.push(coolShit);
	        // console.log(tweet[0].lat);
	        $('#text-list').html(locationsArray[0][1]);
	        $('#country-list').html(locationsArray[0][2]);
	        
		});
})

$(document).on('click', '#stop-stream', function() {

	console.log('stop');
	
	socket.emit('deactivate', 'deactivate');
});



var textStream = function(){

}


