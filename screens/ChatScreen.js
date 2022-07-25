import React, { Component, useState, useRef, useEffect } from "react";
import { Keyboard,KeyboardAvoidingView ,ScrollView, Button, View, Text, TextInput, TouchableOpacity, Dimensions, DeviceEventEmitter, Image, StyleSheet } from "react-native";
import Layout, { LayoutStyle }  from '../components/Layout';   
import Avatar from '../components/Avatar';
import UserService from "../services/UserService";  
import {mapChats} from "../utils/chat";
import uuid from 'react-native-uuid';
import notificationStore, {STATES, get} from '../stores/notificationStore';

import _ from 'lodash';
import 	Toast, {DURATION} from 'react-native-easy-toast'; 
 

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);
console.warn = message => {
	if (message.indexOf('Setting a timer') <= -1) {
		_console.warn(message);
	}
}; 
  
export default class ChatScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			disabledSendButton : true,
			message : '',
			userInfo: {},
			users: [],
			chats: [],
			wsRef: null
		}; 
	}

	 
	 
	async componentDidMount(){  
		notificationStore.subscribe( async () => { 	 
			const state = await notificationStore.getState();
			const { type , payload } = state; 
			if(type === STATES.GET_CHATS){  
				const { users, chats , userInfo} = payload;
 
				console.log("CHATS INIT IS ", chats);
				console.log("USERS INIT IS ", users);
			    this.setState({ users, chats , userInfo});
			}else if(type === STATES.UPDATE_CHATS){ 
				this.setState({ chats  : payload });
			}
		});

		notificationStore.dispatch({ type : STATES.GET_CHATS,  payload : null   }); 
	}

	componentWillUnmount() { 
	}
 


	async sendChat(event) {

			if(event.nativeEvent.locationX  > 230){ //trap x-axis coordinates to let keyboard remain in focus using a keypress with textInput  
		      if(this.state.message !== ''){   

				const cindex = this.state.chats.length + 1; 
				var chatObject  = { _t: 'a'};  //NOTE: be requires this and produces a white screen without it? 
				const chatEntry = {
					text :this.state.message,
					userId: this.state.userInfo.id,
					timeStamp: Date.now(),
					id: uuid.v4()
				}; 
				 
				chatObject[cindex] =   [{ ...chatEntry}];   
				notificationStore.dispatch({ type : STATES.SEND_CHAT,  payload : chatObject    }); 

				var chats = this.state.chats;  
				chats.push(chatEntry);  
				this.setState({ chats, message: '' , disabledSendButton : true});  
			}  
		}
	}
 

 
 


	render() {
		const userId = this.state.userInfo.id;

		const chats =  mapChats(this.state.chats, this.state.users, userId).map((item, index) => {
			const messagestyle = item.isMe ? OwnChat : OtherChat;
			return (
				<View style={styles.itemBox} key={index}>
					<View style={messagestyle.itemAvatar} ><Avatar url={item.avatar_url}></Avatar></View>
					<Text style={messagestyle.itemTime}>{item.time}</Text>
					<Text style={messagestyle.itemMessage}>{item.message}</Text>
				</View>
			)
		}) ;

		return (<Layout screen="chat" navigation={this.props.navigation}  > 
		             
			  <Toast
                ref={(toast) => this.toast = toast}
                style={{backgroundColor:'#333333',  top: 0, position : 'absolute'}} 
                positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8} 
            />
						    
					 
			 <View style={{ ...LayoutStyle.box, height:500 } }>
			
				<Text style={styles.boxTitle}>Chats</Text>
				<ScrollView style={styles.chatScreen}>
					{chats}
				</ScrollView>

				
				<View style={{...styles.sendBox,   height: 50  }} > 

				

				<KeyboardAvoidingView behavior="padding">
					<ScrollView  style={{     width: '100%', height:50}}  showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'> 

										<TextInput style={{marginTop:-5,  paddingBottom:20, height: 55, fontSize:18,    width: '100%',  zIndex: 88 }} 
													value={ this.state.message } 
													onChangeText={text => this.setState({ disabledSendButton : text.length > 0 ? false : true,  message : text } )}  
													onTouchStart={(event) =>  this.sendChat(event)} ></TextInput>  
												<View style={styles.sendButton = {}} style={{ opacity: this.state.disabledSendButton ? 0.5 : 1,  position: 'absolute', right: 7, top: -2, zIndex:76 }}  >
													<Image style={styles.sendIcon} source={require('../assets/images/home/send_icon.png')} />
												</View>  
												
						</ScrollView>
					</KeyboardAvoidingView> 
				</View> 
			</View>
		</Layout>);
	}
}



//other
const OtherChat = StyleSheet.create({
	itemAvatar: { position: 'absolute', left: 10 },
	itemMessage: { marginLeft: 55, fontSize: 12, paddingTop: 35, fontWeight: 'bold' },
	itemTime: { fontSize: 10, color: '#333', position: 'absolute', top: 20, left: 55 },
});

//mine? 
const OwnChat = StyleSheet.create({
	itemAvatar: { position: 'absolute', right: 0 },
	itemMessage: { position: 'absolute', right: 50, top: 35, marginRight: 0, fontSize: 12, fontWeight: 'bold' },
	itemTime: { fontSize: 10, color: '#333', position: 'absolute', top: 20, right: 50 },
});


const styles = StyleSheet.create({
	chatScreen: { transform: [{ rotate: '180deg' }] }, 
	boxTitle: { paddingTop: 20, paddingLeft: 20, marginBottom: 30 },
	itemBox: { marginBottom: 0, marginLeft: 20, width: '90%', height: 60,
	 display: 'flex', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row', 
	 transform: [{ rotate: '180deg' }] },
	sendButton: { width: 40, height: 35, borderRadius: 10, borderWidth: 1 },
	sendBox: { borderRadius: 20, padding: 10, borderWidth: 1, margin: 10, borderColor: '#eee' }
});

