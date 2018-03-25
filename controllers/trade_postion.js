var oBuffer = require("../o_buffer").order;
var fBuffer = require("../f_buffer").fills;
var mongoose  = require('mongoose');
var Trade = require("../models/Schema").Trade;  
var Position = require("../models/Schema").Position;  

exports.createTrade = function (req , res) {
	//Before creating Trade
	//Do something
	if(true) {
		fBuffer.forEach((fill) => {
			var trade1 = new Trade ({
				orderId : oBuffer.orderId,
				clientId : 'CS',
				bookId : fill.bookId ,
				fillId : fill.fillId ,
				side :  oBuffer.side,
				qtySize : fill.qtySize , 
				price : fill.price,
				exId : fill.exId ,
				productId : oBuffer.productId,
				orderStamp : oBuffer.orderStamp,
				exStamp : fill.exStamp ,
				tradeStamp : Date() , 
				counterParty : fill.counterParty,
				commision : 0,
				state : 'Closed'
			});
			
			//Dump Trade to DataBase	
			trade1.save((err) => {console.log(err);});

			//Evaluating Position for Trade1
			evaluatePosition(trade1, fill);

			var exSide = "BUY";
			if(oBuffer.side === "BUY")
				exSide = "SELL";


			if(oBuffer.clientId !== 'CS'){
				var trade2 = new Trade ({
					orderId : oBuffer.orderId,
					clientId : oBuffer.clientId,
					bookId : fill.bookId ,
					fillId : fill.fillId , 
					side :  exSide,
					qtySize : fill.qtySize , 
					price : fill.price,
					productId : oBuffer.productId,
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

var evaluatePosition = function(trade, fill){
	//Position variables
	var lRealisedPL = 0, lUnrealisedPL = 0, lNetPosition = 0, lAvgPrice = 0, lMarketPrice = 0;

	//Taking MarketPrice from #Group2
	lMarketPrice = 97;

	//Updating Position Table for Trade1
	position = mongoose.model('Position', Position, "Position");
	position.findOne( {"bookId" : fill.bookId, "productId" : fill.productId}, (pos) => {
		var fQtySize = parseInt(fill.qtySize);
		if(!pos){
			lAvgPrice = lMarketPrice;
			if(trade.side === "BUY")
				lNetPosition = fill.qtySize;
			else
				lNetPosition = -1 * fQtySize;
			
		}
		if(pos){
			pos.netPosition = parseInt(pos.netPosition);
			pos.qtySize = parseInt(pos.qtySize);
			pos.avgPrice = parseInt(pos.avgPrice);
		}	

		else{
			if(trade.side === "BUY"){
				lNetPosition = pos.netPosition + fill.qtySize;
				if(pos.netPosition > 0){
					lRealisedPL = 0;
					lAvgPrice = (pos.avgPrice * pos.netPosition + lMarketPrice * fQtySize) / (pos.netPosition + fQtySize);
				}
				else if(pos.netPosition < 0){
					if(pos.netPosition + fQtySize < 0){
						lAvgPrice = pos.avgPrice;
						lRealisedPL = (lMarketPrice - pos.avgPrice) * fQtySize;
					}
					else if(pos.netPosition + fQtySize > 0){
						lAvgPrice = lMarketPrice;
						lRealisedPL = (lMarketPrice - pos.avgPrice) * pos.netPosition;
					}
					else{
						lAvgPrice = 0;
						lRealisedPL = (lMarketPrice - pos.avgPrice) * fQtySize;

					}
				}
				else{
					lAvgPrice = lMarketPrice;
					lRealisedPL = 0;
				}
			}
			else{
				lNetPosition = pos.netPosition - fill.qtySize;
				if(pos.netPosition < 0){
					lAvgPrice = (pos.avgPrice * pos.netPosition + lMarketPrice * fQtySize) / (pos.netPosition + fQtySize);
					lRealisedPL = 0;
				}
				else if(pos.netPosition > 0){
					if(pos.netPosition - fQtySize > 0){
						lAvgPrice = pos.avgPrice;
						lRealisedPL = (lMarketPrice - pos.avgPrice) * fQtySize;
					}
					else if(pos.netPosition - fQtySize < 0){
						lAvgPrice = lMarketPrice;
						lRealisedPL = (lMarketPrice - pos.avgPrice) * pos.netPosition;
					}
					else{
						lAvgPrice = 0;	
						lRealisedPL = (lMarketPrice - pos.avgPrice) * fQtySize;
					}	
				}
				else{
					lAvgPrice = lMarketPrice;
					lRealisedPL = 0;
				}
			}
		}
	});

	var position = new Position({
		bookId : trade.bookId,
		productId : trade.productId,
		realisedPL : lRealisedPL,
		unrealisedPL : lUnrealisedPL,
		netPosition : lNetPosition,
		avgPrice : lAvgPrice,
		marketPrice : lMarketPrice
	})
	//Dump Position to DataBase	
	position.save((err) => {console.log(err);});
	return;

}

var validate = function(){
	if(oBuffer.price >= 0 && oBuffer.qtySize >= 0 ){

	}
}

var figuration = function () {
	return 1;
}
