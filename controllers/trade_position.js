var oBuffer = require("../o_buffer").order;
var fBuffer = require("../f_buffer").fills;
var mongoose  = require('mongoose');
var Trade = require("../models/Schema").Trade;
var Position = require("../models/Schema").Position;
var csv_obj = require('csv');
var fs = require('fs');
var parse = require('csv-parse');

//Utility functions
var validate = (fill) => {
	return new Promise(function(resolve, reject) {
		fs.createReadStream('./stat1.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', function(client) {
			//validate client [0]=cl_id [1]=valid ? yes : no [2]=comm_type
			if (parseInt(fill.price) >= 0 && parseInt(fill.qtySize) >= 0 ) {
				if (oBuffer.clientId === client[0]) {
					resolve({"valid" : client[1] , "commType" : client[2]})
				}
			}
    })
    .on('end',function() {
			resolve({"valid" : 'NA' , "commType" : 'NA'})
    });
  })
}

var figuration = (fill, commisionType, clientId, clientStat) => {
	return new Promise(function(resolve, reject) {
		var rate = 10;	//Take input from clientStat
		var amt = 100;	// Assigned temporarily
		console.log(commisionType);
		if(commisionType === 'cents/share') {
			console.log("1");
			resolve(parseInt(fill.qtySize)*parseInt(fill.price)* rate/10000);
		}
		if(commisionType === 'flat') {
			console.log("2");
			resolve(amt);
		}
		if(commisionType === 'basis pt') {
			console.log("3");
			resolve(-1);
		}
	})
}


exports.createTrade = function (req , res) {
	//Before creating Trade
	fBuffer.forEach((fill) => {
		validate(fill).then((clientInfo) => {
			if(clientInfo.valid === 'yes') {
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
				//evaluatePosition(trade1, fill);

				var exSide = "BUY";
				if(oBuffer.side === "BUY")
					exSide = "SELL";

				figuration(fill, clientInfo.commType, oBuffer.clientId, clientInfo).then((comm) => {
					console.log(oBuffer.clientId + "figuration resolved : ");
					if(oBuffer.clientId !== 'CS') {
						console.log("comm"  +  comm);
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
							commision : comm,
							state : 'Closed'
						});

						//Dump Trade to DataBase
						trade2.save((err) => {console.log(err);});

						//Evaluating Position for Trade2
						//evaluatePosition(trade2, fill);
					}
				})
			}
		})
	})
}

var evaluatePosition = function(trade, fill){
	//Position variables
	var lRealisedPL = 0, lUnrealisedPL = 0, lNetPosition = 0, lAvgPrice = 0, lMarketPrice = 0;

	//Taking MarketPrice from #Group2
	lMarketPrice = 97;

	//Updating Position Table for Trade1
	Position.findOne( {"bookId" : fill.bookId, "productId" : fill.productId}, (pos) => {
		var fQtySize = parseInt(fill.qtySize);
		if(!pos){
			lAvgPrice = lMarketPrice;
			if(trade.side === "BUY")
				lNetPosition = fill.qtySize;
			else
				lNetPosition = -1 * fQtySize;

		}
		else {
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
	console.log("hmmm here");

	var position2 = new Position({
		bookId : trade.bookId,
		productId : trade.productId,
		realisedPL : lRealisedPL,
		unrealisedPL : lUnrealisedPL,
		netPosition : lNetPosition,
		avgPrice : lAvgPrice,
		marketPrice : lMarketPrice
	})
	//Dump Position to DataBase
	position2.save((err) => {console.log(err);});
	return;

}
