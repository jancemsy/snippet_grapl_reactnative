import io from "socket.io-client";

var graplWS = function(){};
graplWS.socket = null; 
const config = require('../config.json');
const url = config.endpoint || "https://api-staging.grapl.it";

graplWS.events = {};

graplWS.publish = function(name, data) {
    var handlers = graplWS.events[name];
    if(!!handlers === false) return;
    handlers.forEach(function(handler) {
      handler.call(graplWS, data);
    });
};

graplWS.subscribe = function(name, handler) {
    var handlers = graplWS.events[name];
    if(!!handlers === false) {
      handlers = graplWS.events[name] = [];
    }
    handlers.push(handler);
};

graplWS.unsubscribe = function(name, handler) {
    var handlers = graplWS.events[name];
    if(!!handlers === false) return;

    var handlerIdx = handlers.indexOf(handler);
    handlers.splice(handlerIdx);
  };
// local
//const url = process.env.REACT_APP_BE_URL || "https://293b-114-108-224-199.ngrok.io/api"
graplWS.participants = {};
graplWS.connect = function(roomName, token, callback) {
	let socket = io(url + '/' +  roomName);
	const debug = false;
	if (debug) {
		socket._onevent = socket.onevent;
		// Replace the onevent function with a handler that captures all messages
		socket.onevent = function (packet) {
		  // Compare the list of callbacks to the incoming event name
		  if( !Object.keys(socket._callbacks).map(x => x.substr(1)).includes(packet.data[0]) ) {
			 console.log(`WARNING: Unhandled Event: ${packet.data}`);
			 console.log(packet.data);
		  }
		  socket._onevent.apply(socket, Array.prototype.slice.call(arguments));
		}
	}

	socket.connect();

	socket.on("connect", () => {
		console.log('graplWS Connected');
		console.log('graplWS Emitting MeetingRequest');
		socket.emit('MeetingRequest', { token:token, password:token }, function(data) {
			graplWS.participants = data.users;
			graplWS.publish('participants', graplWS.participants);
			callback(socket.id);
		});
		console.log('graplWS Emitting CallConnected');
		socket.emit('message', {
				action:'CallConnected',
				connectionType: "main",
				data: {action:'CallConnected'},
				event: "message"
		});

	});

	graplWS.socket = socket;
	return graplWS.socket;
}

graplWS.callDisconnect = function(){
	if(!graplWS.socket) { return; }
	graplWS.socket.emit('message', {
			action:'CallConnected',
			connectionType: "main",
			data: {action:'CallConnected'},
			event: "message"
	});

	setTimeout(()=>{
		graplWS.socket.disconnect();
	},800);
}

graplWS.onMeetingEvents = function(callback) {
	if(!graplWS.socket) { return; }

	graplWS.socket.on("WebRTCParticipantChange", (listOfParticipants) => {
		//var newParticipant = graplWS.participants[userId];
		let _listOfParticipants = listOfParticipants.map(function(c) {
			let data = graplWS.participants[c];
			data = data ? data : null;
			data["userId"] = c;

			return data;
		});

		_listOfParticipants = _listOfParticipants.filter(function(data){
			return data.type;
		})
		if (callback) {
			callback(_listOfParticipants);
		}
	});

	graplWS.socket.on("message", (message) => {
		if (message && message.action == 'UserData') {
				console.log('userData', message);
				graplWS.participants = message.data;
				graplWS.publish('participants', graplWS.participants);
		}
	});
}


module.exports = graplWS;
