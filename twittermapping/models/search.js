var mongoose = require('mongoose');

var SearchSchema = new mongoose.Schema({
	search_history: String,
	favorites: Boolean

});
var Search = mongoose.model('Search', SearchSchema);
module.exports = Search;