const mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Trade = mongoose.model( 'Trade' , new Schema({
	orderId : String ,
	clientId : String ,
	bookId: String,
	tradeId : ObjectId ,
	fillId : Number ,
	qtySize : Number ,
	productId : String, 
	price : Schema.Types.Decimal128 ,
	exId : String ,
	orderStamp : { type: Date, default: Date.now } ,
	exStamp : { type: Date, default: Date.now } ,
	tradeStamp : { type: Date, default: Date.now } , 
	counterParty : String ,
	state : String,
	commision : Number  		
}))

var Position = mongoose.model('Position' , new Schema({
	orderId : String ,
	clientId : String ,
	bookId : String,
	productId : String,
	realisedPL : Schema.Types.Decimal128 ,
	unrealisedPL : Schema.Types.Decimal128 ,
	netPosition : Number , 
	avgPrice : Schema.Types.Decimal128 ,
	marketPrice : Schema.Types.Decimal128   
}))


module.exports = {Trade : Trade , Position : Position}
