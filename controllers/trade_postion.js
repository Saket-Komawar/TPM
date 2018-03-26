var oBuffer = require("../o_buffer").order;
var fBuffer = require("../f_buffer").fills;
var mongoose  = require('mongoose');
var Trade = require("../models/Schema").Trade;  
var Position = require("../models/Schema").Position;  
var csv = require('csv');
var csv_obj = csv();

exports.createTrade = function (req , res) {
	//Before creating Trade
	var clientStat = init();
	fBuffer.forEach((fill) => {
		//Do something
		(valid, commisionType) = validate(fill, clientStat);
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
				commision : figuration(fill, commissionType),
				state : 'Closed'
			});		
			//Dump Trade to DataBase	
			trade2.save((err) => {console.log(err);});
		}
	})
}
 
function getClientStat(id, valid, commision){
	this.Id = id;
	this.Valid = valid
	this.Comm = commision;
}

function init(){
	var clientStat = [];
	csv_obj.from.path('../stat1.csv').to.array(function (data) {
	    for (var index = 0; index < data.length; index++) {
	        clientStat.push(new getClientStat(data[index][0], data[index][1], data[index][2]));
	    }
	    console.log(clientStat);
	});
	return clientStat;
}

var validate = function(fill, clientStat){
	if(fill.price >= 0 && fill.qtySize >= 0 ){
		for(var index = 0; index < clientStat.length; index++){
			if(clientStat[index][0] === fill.clientId){
				return (clientStat[index][1], clientStat[index][2]);
			}
			else
				return ('NA', 'NA');
		}
	}
}

var figuration = function (fill, commisionType) {
	if(commisionType == 'cents/share')
		;//Do something
	else if(commisionType == 'flat')
		;//Do something
	else if(commisionType == 'basis pt')
		;//Do something
	return -1;
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
		else{
			pos.netPosition = parseInt(pos.netPosition);
			pos.qtySize = parseInt(pos.qtySize);
			pos.avgPrice = parseInt(pos.avgPrice);

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


