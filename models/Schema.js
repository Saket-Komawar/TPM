const mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Trade = mongoose.model( 'Trade' , new Schema({
	orderID : String ,
	clientID : String ,
	tradeID : Number ,
	fillID : Number ,
	qtySize : Number , 
	price : Schema.Types.Decimal128 ,
	exchangeID : Number ,
	orderStamp : { type: Date, default: Date.now } ,
	exchangeStamp : { type: Date, default: Date.now } ,
	tradeStamp : { type: Date, default: Date.now } , 
	counterParty : String ,
	commision : Number  		
}))

var Position = mongoose.model('Position' , new Schema({
	orderID : String ,
	clientID : String ,
	realisedPL : Schema.Types.Decimal128 ,
	unrealisedPL : Schema.Types.Decimal128 ,
	netPosition : Number , 
	avgPrice : Schema.Types.Decimal128 ,
	marketPrice : Schema.Types.Decimal128   
}))


module.exports = {Trade : Trade , Position : Position}
