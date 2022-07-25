import io from "socket.io-client"; 
import  * as api from "../api/notifications";  
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { getAvatar } from "../utils/user";
import notificationStore, {STATES} from '../stores/notificationStore';
import UserService from "./UserService";
const config = require('../config.json'); 
const url = `${config.endpoint}` || "https://api-staging.grapl.it";  
export const roomName = '61d535aa175e5206c8ef1afe'; //TODO: transfer this later    
   
const set = async function(field,val){
	await AsyncStorage.setItem( field , val);  
}

const get = async function(field,val){
	await AsyncStorage.setItem( field , val);  
}


const  Websocket = function(roomName, token, meetingCallback){    
	const socket = new io(url + '/' +roomName); 
	console.log('room connected  ==> ' + url + '/' + roomName ); 
	socket.emit('MeetingRequest', { token:token, password:token }, meetingCallback); 
	socket.callDisconnect = function(){
	socket.emit('message', {
		action:'CallConnected',
		connectionType: "main",
		data: {action:'CallConnected'},
		event: "message"
	}); 

	socket.disconnect();
	}
    return socket;
}

export default class AppService{ 

	wsRef = null  
	userInfo = null;
	disabledSendButton = true;
	message = '';
	lastSeenMessageMap = [];
	users =  [];
	chats = [];


	constructor(){ 
	} 

 
  
	async connect() {
		
		this.userInfo = await UserService.getUserData(); 
		this.wsRef = Websocket(roomName, this.userInfo.token, this.onMeetingReady.bind(this)); 
		this.wsRef.on('message', this.onMessage.bind(this));  
		this.wsRef.on('NotificationUpdate',this.onNotificationUpdate.bind(this));   
	}

	//TODO: this will be triggered in app.js 
	disconnect() { 
		const ws = this.state.wsRef;
		ws.callDisconnect();
	}
 

 
	setChats(payload){
		console.log("setChats __________________________________________________________XXXXXXXXXXXX", payload); 
		this.chats = payload;
		notificationStore.dispatch({ type : STATES.UPDATE_CHATS,  payload  }); 
	} 
	
	setUsers(payload){
		console.log("setUsers __________________________________________________________", payload); 
		this.users = payload;  
		notificationStore.dispatch({ type : STATES.UPDATE_USERS,  payload  }); 
	}

	setNotifications(payload){
		console.log("setNotifications __________________________________________________________", payload);
		payload = payload || [];
		this.notifications = payload;
		notificationStore.dispatch({ type : STATES.UPDATE_NOTIFICATIONS,  payload  });  
	} 

  sendChat(payload){ 
	console.log("SEND CHAT TEST----------------------<",'chat',  { chats: payload });

	 this.updateWidget('chat',  { chats: payload }); 
  } 

	async onMeetingReady(passedMeeting) {
		console.log("onMeetingReady__________________________________________________",passedMeeting);
		try {
			const { widgets, users } = passedMeeting;
			this.lastSeenMessageMap = widgets.chat.lastSeenMessageMap;
			this.updateUsers(users);   
			this.setChats(widgets.chat.chats); 
			this.wsRef.emit('message', {
					action:'CallConnected',
					connectionType: "main",
					data: {action:'CallConnected'},
					event: "message"
			}); 

			
		   this.notificationReady();
		   this.updateLastSeen(); 

		} catch (e) {
			console.log("[CHAT ERRROR]", e);
		}
	}

	 
	async processNotifications(notifications){
		console.log("processNotifications______________________________________________________________",notifications);
		const _notifications  = notifications.filter(item =>{ 
			   return (item.notify_user === this.userInfo.id && item.badge_counted === false)
		}).map( item =>{  
				 var user = this.users.find((u) => u.id === item.author) || {};  
				 return { name: user.name , avatar_url: getAvatar(user), message: "Mentioned you in Chat", time:  item.updatedAt } 
			 }   );

		this.setNotifications(_notifications); 
	}


	async onNotificationUpdate(payload){ 
		console.log("onNotificationUpdate______________________________________________________________",payload);
		var notifications = this.notifications || [];
		notifications.push(payload); 
		this.processNotifications(notifications);
	} 

	async notificationReady(){   
		console.log("notificationReady______________________________________________________________");
		const result = await api.getNotifications(roomName); 
		this.processNotifications(result.data.notifications);  
	} 

	async updateWidget(_name, _delta,  _action = 'UpdateWidget'){ 		 
		console.log("updateWidget______________________________________________________________");
		const params = {
			name : _name, 
			action : _action, 
			userId: this.userInfo.id,
			data: {
				name: _name,
				timestamp: Date.now(),
				delta: _delta
			}, 
		}; 
		this.wsRef.emit('message', params);    
	} 

	async updateLastSeen(){   
		console.log("updateLastSeen()_____________________________________________________________");
		const lastChat = this.chats[this.chats.length -1]; 
 
		var lastSeenMessageMap = {};
		Object.entries(this.lastSeenMessageMap || []).forEach((entry) =>{   
			lastSeenMessageMap[entry[0]] = [entry[1]];
		});
		
		lastSeenMessageMap[this.userInfo.id] = [lastChat?.id];  
		this.updateWidget('chat',  { lastSeenMessageMap, userList: [...this.users, this.userInfo.id] });
	}

 



   async updateUsers(data){
	   console.log("updateUsers()_____________________________________________________________",data);
		const users = Object.entries(data).map(([id, user]) => ({
			id,
		...user,
		avatar_url:  getAvatar(user)
		}));

		this.setUsers(users); 
   }									


	async onMessage(message) {

		console.log("App onMessage ----------------------------------------------------------------------", message.action);
		try {
		 
			if (message.action === 'UserData' ){ 
				this.updateUsers(message.data); 
			}else if (message.action === 'UpdateWidget' && message.name === 'chat') { //only accept the chat for this purpose :)   
				const delta = message.data.delta;

				if (delta.chats) {  
					let chats = this.chats;
					const entries = Object.entries(delta.chats);
					for (var i = 0; i < entries.length; i++) {
						var c = entries[i]; 
						//var key = c[0];
						var data = c[1];
						if (Array.isArray(data)) {
							for (var j = 0; j < data.length; j++) {
								chats.push(data[j]);
							}
						}
					}

					this.setChats(chats);
				}
			}else{   	
				//console.log(`onMessage:________________________________________`,message);
			}
		} catch (e) {
			console.log(`ERROR-onMessage:${e}`);
		}
	}
 
}