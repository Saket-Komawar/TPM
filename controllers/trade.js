var oBuffer = require("../o_buffer");
var fBuffer = require("../f_buffer");
var Trade = require("../models/Schema").Trade;  

exports.createTrade = function (req , res) {
	
		var trade = new Trade ({
			orderID : oBuffer.orderID,
			clientID : oBuffer.clientID,
			tradeID : oBuffer.tradeID,
			fillID : oBuffer.fillID , 
			qtySize : oBuffer.qtySize , 
			price : oBuffer.price,
			exchangeID : oBuffer.exchangeID ,
			orderStamp : oBuffer.orderStamp,
			exchangeStamp : oBuffer.exchangeStamp ,
			tradeStamp : oBuffer.tradeStamp , 
			counterParty : oBuffer.counterParty,
			commision : oBuffer.commision	
		});
} 

var validate = function(){
	if(oBuffer.price >= 0 && oBuffer.qtySize >= 0 ){

	}
}

exports.figuration = function (req , res) {
}

