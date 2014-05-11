var io = require('net.iamyellow.tiws');
var websocket = io.createWS();

var _connectionStatus = false;
var _lastReceivedMessage = 0;
var _isReconnecting = false;
var _argu = null;

var socketHandler = function(args) {

	argu = args;
	var that = this;
	
	//Setup the timer checker timer, and add object refrence to the timer object ot be able to access the socketHandler from inside the EventListener
	setTimeout(function() {
		that.timer.start({
			interval : 3000,
			debug : true
		});

	}, 5000);

	this.timer.object = this;
	this.registerTimer(this);
	websocket.object = this;

	Ti.App.addEventListener('disconnected', function(event) {

		Ti.App.fireEvent("reconnecting", {
			object : websocket
		});

		if (!_isReconnecting) {

			websocket = null;
			websocket = io.createWS();
			_isReconnecting = true;

		} else {

			websocket.open(argu["URL"]);
			websocket.addEventListener('open', function(ev) {
				_isReconnecting = false;

				Ti.App.fireEvent("connected", {
					object : this.object
				});

			});

			websocket.addEventListener('message', function(ev) {
				// ev.data contains message data

				_lastReceivedMessage = Math.round((new Date()).getTime() / 1000);
				var stocks = eval("(" + ev.data + ")");

				for (var i = 0; i < stocks.length; i++) {
					cellName = stocks[i].stockName;
					cell = Grid.cellIndex[cellName];
					Grid.updateCell(cell, stocks[i].stockName, stocks[i].changeValue, stocks[i].lastPrice, stocks[i].change, stocks[i].stockCurrency);
				}

			});

			websocket.addEventListener('close', function(ev) {

				Ti.App.fireEvent("disconnected", {
					object : this.object
				});

				socketHandler.connected = false;
			});

			websocket.addEventListener('error', function(ev) {
				// ev.error contains error description, if any

				Ti.App.fireEvent("disconnected", {
					object : this.object
				});
			});

		}
	});

	Ti.App.addEventListener("connected", function(event) {
		_connectionStatus = true;
	});

};
var MessagingObject = socketHandler;

socketHandler.prototype.argu;
socketHandler.prototype._lastReceivedMessage = 0;
socketHandler.prototype.connected = false;

socketHandler.prototype.timer = require("ti.mely").createTimer();

socketHandler.prototype.checkMessagingStatus = function(event) {

	currentTime = Math.round((new Date()).getTime() / 1000);

	if ((currentTime - _lastReceivedMessage) >= 10 || _connectionStatus == false) {
		this.object.fireDisconnected(null);

	}

};

socketHandler.prototype.registerTimer = function() {
	this.timer.addEventListener('onIntervalChange', this.checkMessagingStatus, false);
};

socketHandler.prototype.connect = function(uri) {
	websocket.open(argu["URL"]);
	Ti.App.fireEvent("opening", {
		time : new Date().getTime()
	});

	websocket.addEventListener('open', function(ev) {
		_isReconnecting = false;

		Ti.App.fireEvent("connected", {
			object : this.object
		});

	});

	websocket.addEventListener('message', function(ev) {
		// ev.data contains message data
		_lastReceivedMessage = Math.round((new Date()).getTime() / 1000);
		var stocks = eval("(" + ev.data + ")");

		for (var i = 0; i < stocks.length; i++) {
			cellName = stocks[i].stockName;
			cell = Grid.cellIndex[cellName];
			Grid.updateCell(cell, stocks[i].stockName, stocks[i].changeValue, stocks[i].lastPrice, stocks[i].change, stocks[i].stockCurrency);
		}

	});

	websocket.addEventListener('close', function(ev) {

		Ti.App.fireEvent("disconnected", {
			object : this.object
		});

		socketHandler.connected = false;
	});

	websocket.addEventListener('error', function(ev) {
		// ev.error contains error description, if any

		Ti.App.fireEvent("disconnected", {
			object : this.object
		});
	});
};

socketHandler.prototype.fireDisconnected = function() {
	Ti.App.fireEvent("disconnected", {
		time : new Date().getTime(),
		object : this
	});
	_connectionStatus = false;
};

socketHandler.prototype.sendMessage = function(message) {
	if (_connectionStatus) {
		websocket.send(message);
	} else {
		Ti.API.debug("No connection asln");
	}
};

socketHandler.prototype.websocket = websocket;
module.exports = socketHandler; 