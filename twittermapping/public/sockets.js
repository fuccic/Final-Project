// =============
// Sockets Twitter 
// =============
var socket = io();

var locationsArray = [];
var textArray = [];
var citiesArray = [];
var locationsCounter = [];
var wordCounter = [];
// var counter = 0;
// console.log(locationsArray);

$(document).on('click', '#start-stream', function(){
	console.log('start-stream');

	socket.emit('activate', 'activate');

	    socket.on('twitter-stream', function(tweet) {

	    //only selects tweets with coordinates
			locationsArray = [];
	        var coolShit = tweet;
	        locationsArray.push(coolShit);

	        // locationsArray[ tweet.id ] = tweet;

	        locationsCounter.push(locationsArray[0][2]);
	        wordCounter.push(locationsArray[0][1]);
	        // console.log(locationsCounteter);
	        $('#text-things').html(locationsArray[0][1]);
	        $('#country-things').html(locationsArray[0][2]);
	        
		});
})

$(document).on('click', '#stop-stream', function() {

	console.log('stop');
	
	socket.emit('deactivate', 'deactivate');
});


$(document).on('click', '#search-location', function(){
	locationSearch();
})

$(document).on('click', '#search-topic', function(){
	textSearch();
})



var locationSearch = function(){
	var search = $('#search-bar').val();
	// console.log(locationsCounter);
	var counter = 0;
	for (var i = 0; i < locationsCounter.length; i++) {
		if(locationsCounter[i] === search){
			counter++
			// console.log(counter);
		}
	};
	$('#location-search-result').html(search + ' ' +counter);
}

var textSearch = function(){
	console.log("This is the tweets array",wordCounter);
	var counter = 0;
	var search = $('#search-bar').val();
	for (var i = 0; i < wordCounter.length; i++) {
		var splitWord = wordCounter[i].split(" ");
		console.log("This is the split up word", splitWord);
		for (var x = 0; x < splitWord.length; x++) {
			if(splitWord[x] === search){
				counter++
				console.log(counter);
				
			}
		}
	}
	$('#text-search-result').html(search + " " + counter);
}


