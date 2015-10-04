tiws-connector
==============

### Description
TiWS Connector is simple module that extends the functionality of iamyellow TiWS native module (https://github.com/iamyellow/tiws).

It adds reconnecting functionality, and even more fun.

### Requirements
TiWs: https://github.com/iamyellow/tiws
Ti.mely: https://github.com/benbahrenburg/ti.mely

### Methods

#### socketHandler.connect();

Starts Websocket connection, and adds its Events Listeners, and you can access the Websocket object using

```
socketHandler.websocket;
```

#### socketHandler.sendMessage(message)

You can use this to send any message to the server, the message param takes any kind of data that can be sent over web socket connection.

#### socketHandler.close();

Closes the Websocket connection.

#### socketHandler.setEnableReconnecting();

Enables the reconnection option in your websocket app.

#### socketHandler.attemptReconnecting();

Fires disconnected event, and attempts the reconnection.

#### socketHandler.checkMessagingStatus();

Checks the messaging status, and confirms that you're recieving data.

#### socketHandler.setCheckMessagingStatusInterval(value); (value = time in seconds)

Sets the max time the client should be waiting for data before it goes into reconnecting mode. Default is 10 seconds.

### (socketHandler) Events

The following Events can be handeled easily using Ti.App.addEventListener.

#### connected

Event fired when connection to a websocket is completed.

#### disconnected

Event fired when you get disconnected from websocket.

#### reconnecting

Event fired when you get attempt to reconnect to the websocket.

#### websocketMessage

Event fired when you recieve websocket message.

Handeled like this:

```
Ti.App.addEventListener("websocketMessage", function(e) {
		Ti.API.log(e.event.data);
});
```

### (websocket) Events

You can listen to those events by adding Event Listener to the Proprity socketHandler.websocket

#### open

#### close

#### message

#### error
