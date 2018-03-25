var oBuffer = require("../o_buffer").order;
var fBuffer = require("../f_buffer").fills;
var Trade = require("../models/Schema").Trade;  

exports.createTrade = function (req , res) {
	//Before creating Trade
	//Do something
	if(true) {
		fBuffer.forEach((fill) => {
			var trade1 = new Trade ({
				orderId : oBuffer.orderId,
				clientId : 'CS',
				fillId : fill.fillId , 
				qtySize : fill.qtySize , 
				price : fill.price,
				exId : fill.exId ,
				orderStamp : oBuffer.orderStamp,
				exStamp : fill.exStamp ,
				tradeStamp : Date() , 
				counterParty : fill.counterParty,
				commision : 0,
				state : 'Closed'
			});
			
			//Dump Trade to DataBase	
			trade1.save((err) => {console.log(err);});

			if(oBuffer.clientId !== 'CS'){
				var trade2 = new Trade ({
					orderId : oBuffer.orderId,
					clientId : oBuffer.clientId,
					fillId : fill.fillId , 
					qtySize : fill.qtySize , 
					price : fill.price,
					exId : fill.exId ,
					orderStamp : oBuffer.orderStamp,
					exStamp : fill.exStamp ,
					tradeStamp : Date() , 
					counterParty : fill.counterParty,
					commision : figuration(),
					state : 'Closed'
				});		
				//Dump Trade to DataBase	
				trade2.save((err) => {console.log(err);});
			}

		})
			
	}		
} 

var validate = function(){
	if(oBuffer.price >= 0 && oBuffer.qtySize >= 0 ){

	}
}

var figuration = function () {
	return 1;
}


//Create Trade
			var trade = new Trade ({
				orderId : oBuffer.orderId,
				clientId : oBuffer.clientId,
				tradeId : oBuffer.tradeId,
				fillId : oBuffer.fillId , 
				qtySize : oBuffer.qtySize , 
				price : oBuffer.price,
				exchangeId : oBuffer.exchangeId ,
				orderStamp : oBuffer.orderStamp,
				exchangeStamp : oBuffer.exchangeStamp ,
				tradeStamp : oBuffer.tradeStamp , 
				counterParty : oBuffer.counterParty,
				commision : oBuffer.commision	
			});