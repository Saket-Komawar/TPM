var buffer = require("../o_buffer");
var Trade = require("../models/Schema").Trade;  

exports.createTrade = function (req , res) {
	
	var trade = new Trade ({
		orderID : buffer.orderID,
		clientID : buffer.clientID,
		tradeID : buffer.tradeID,
		fillID : buffer.fillID , 
		qtySize : buffer.qtySize , 
		price : buffer.price,
		exchangeID : buffer.exchangeID ,
		orderStamp : buffer.orderStamp,
		exchangeStamp : buffer.exchangeStamp ,
		tradeStamp : buffer.tradeStamp , 
		counterParty : buffer.counterParty,
		commision : buffer.commision	
	});
} 

exports.validate = function (req , res) {
}

exports.figuration = function (req , res) {
}

