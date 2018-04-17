const mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Trade = mongoose.model( 'Trade' , new Schema({
	tradeId : ObjectId ,
	orderId : String ,
	clientId : String ,
	bookId: String,
	fillId : String ,
	side : String,
	qtySize : String ,
	productId : String,
	price : String ,
	exId : String ,
	orderStamp : { type: Date, default: Date.now } ,
	exStamp : { type: Date, default: Date.now } ,
	tradeStamp : { type: Date, default: Date.now } ,
	counterParty : String ,
	state : String,
	commision : Number
}) , "Trade")

var Position = mongoose.model('Position' , new Schema({
	bookId : String,
	productId : String,
	realisedPL : String ,
	unrealisedPL : String ,
	netPosition : String ,
	avgPrice : String ,
	marketPrice : String
}) , "Position")


module.exports = {Trade : Trade , Position : Position}
