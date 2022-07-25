import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    TouchableOpacity,
	 Dimensions,
	 Platform,
	 Image,
	 FlatList,
	 AsyncStorage,
    PermissionsAndroid,
	 TouchableHighlight
} from 'react-native';
import {
    TwilioVideoLocalView, // to get local view
    TwilioVideoParticipantView, //to get participant view
    TwilioVideo
} from 'react-native-twilio-video-webrtc';
import NavBarMeeting from '../../components/NavBarMeeting';
const graplWS = require('../../api/ws.js');
import Toast, {DURATION} from 'react-native-easy-toast';

import ICON_MENU from '../../assets/images/icons/ic_menu.png';
import ICON_MICROPHONE_ORANGE from '../../assets/images/icons/ic_mic_orange.png';
import ICON_MICROPHONE_OFF from '../../assets/images/icons/ic_mic-off.png';
import ICON_VIDEO from '../../assets/images/icons/ic_video.png';
import ICON_PHONE from '../../assets/images/icons/ic_phone.png';
import ICON_SCREENSHARE from '../../assets/images/icons/ic_screenshare.png';
import ICON_MORE from '../../assets/images/icons/ic_more.png';
import ICON_CROWN_ORANGE from '../../assets/images/icons/ic_crown_orange.png';

import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const LAYOUT_GRID_2 = 1;
const LAYOUT_GRID_1_COLUMN = 2;
const LAYOUT_GRID_2_COLUMN = 3;

const colors = [
	'#663399',
	'#9acd32',
	'#ee82ee',
	'#4682b4',
	'#6a5acd',
	'#2e8b57',
	'#8b4513',
	'#4169e1',
	'#cd853f',
	'#db7093',
	'#ff4500',
	'#6b8e23',
	'#191970',
	'#0000cd'
];

export default class Meeting extends Component {

	state = {
		 isAudioEnabled: true,
		 isVideoEnabled: false,
		 isCameraFliped: true,
		 isButtonDisplay: true,
		 status: 'disconnected',
		 participants: new Map(),
		 videoTracks: new Map(),
		 videoTracksArray: [],
		 layout: LAYOUT_GRID_2_COLUMN,
		 roomName: '',
		 token: '',
		 email: "",
		 name: "",
		 identity: "",
		 attendees: []
	}

	componentDidMount() {
		let navigationState = this.props.navigation.getState();
		console.log(navigationState.routes[navigationState.index].params);
		let params = navigationState.routes[navigationState.index].params;
		this.setState({
			roomName: params.roomName,
			token: params.token,
			email: params.email,
			name: params.name
		}, ()=> {
			this._onConnectButtonPress();
		});
		activateKeepAwake();

		// set current user
		let currentUser = {
			email: params.email,
			name: params.name,
			joined: Date.now(),
			last_seen: Date.now(),
			identity: params.identity,
			type: params.type == 'guest' ? "guest" : "account",
			userId: params.identity.split('::')[1],
			ws_id: params.identity.split('::')[2]
		};

		graplWS.subscribe('participants', (participants)=>{
			//graplWS.participants
		});


		let mergedCurrentUser = Object.assign({}, currentUser, graplWS.participants[params.identity.split('::')[1]]);
		let online = this.filterOnlineUsers(graplWS.participants);

		console.log('online', online);
		console.log('mergedCurrentUser', mergedCurrentUser);
		console.log('graplws', graplWS.participants);
		this.setState({
			currentUser: mergedCurrentUser,
			attendees: online
		});
		// graplWS.onMeetingEvents((payload) => {
		// 	console.log('new participants', payload);
		// 	let data = [mergedCurrentUser];
		//
		// 	data = data.concat(payload);
		// 	this.setState({ attendees: data });
		// });
	}

	filterOnlineUsers(participantObject) {
		let online = [];
		Object.keys(participantObject).forEach(function(participantId){
			if (graplWS.participants[participantId]) {
				if (graplWS.participants[participantId]["status"] == 'online') {
					online.push(Object.assign({userId: participantId}, graplWS.participants[participantId]));
				}
			}
		});
		return online;
	}

	switchLayout() {
		// toggle between 2 column and 1 column
		this.setState({
			layout: this.state.layout == LAYOUT_GRID_1_COLUMN ? LAYOUT_GRID_2_COLUMN : LAYOUT_GRID_1_COLUMN
		});
	}

	_onConnectButtonPress = async () => {
		const myToken = this.state.token;
	    console.log("in on connect button preess");
	    this.refs.twilioVideo.connect({
			 roomName: this.state.roomName,
			 accessToken: myToken,
			 enableVideo: true,
			 enableAudio: true
		 });
	    this.setState({status: 'connecting'})
	    console.log(this.state.status);
	  }

	_onEndButtonPress = () => {
	    this.refs.twilioVideo.disconnect()
	  }

	_onMuteButtonPress = () => {
	    // on cliking the mic button we are setting it to mute or viceversa
		 this.toast.show(`Audio ${this.state.isAudioEnabled ? 'muted' : 'unmuted'}`, 1000, () => {
		    // something you want to do at close
		});
	    this.refs.twilioVideo.setLocalAudioEnabled(!this.state.isAudioEnabled)
	      .then(isEnabled => this.setState({isAudioEnabled: isEnabled}))
	  }
	_onFlipButtonPress = () => {
	    // switches between fronst camera and Rare camera
	    this.refs.twilioVideo.flipCamera();
		 this.toast.show(`Using ${this.state.isCameraFliped ? 'Front' : 'Back'} camera`, 1000, () => {
		    // something you want to do at close
		});
		 this.setState({ isCameraFliped: !this.state.isCameraFliped });

	  }
	_onRoomDidConnect = () => {
	    console.log("room did connected");
	    this.setState({status: 'connected'})
		 this.toast.show(`Connected`, 1000, () => {
			// something you want to do at close
	  	});
	    // console.log("over");
	  }

	  _onDisableVideoButtonPress = () => {
		  this.toast.show(`Video ${this.state.isVideoEnabled ? 'disabled' : 'enabled'}`, 1000, () => {
			  // something you want to do at close
		 });
		  this.refs.twilioVideo.setLocalVideoEnabled(!this.state.isVideoEnabled).then((isEnabled)  => {
			  this.setState({ isVideoEnabled: isEnabled })
		  });
	  }

	_onRoomDidDisconnect = ({roomName, error}) => {
		this.toast.show(`You have left the room`, 1000, () => {
			// something you want to do at close
	  });
	    console.log("ERROR: ", JSON.stringify(error))
	    console.log("disconnected")
		 deactivateKeepAwake();
	    this.setState({status: 'disconnected'})
		 graplWS.callDisconnect()
		 this.props.navigation.goBack();
	  }
	_onRoomDidFailToConnect = (error) => {
		this.toast.show(`Failed to join room`, 1000, () => {
			// something you want to do at close
	  });
	    console.log("ERROR: ", JSON.stringify(error));
	    console.log("failed to connect");
		 deactivateKeepAwake();
	    this.setState({status: 'disconnected'})
		 graplWS.callDisconnect()
		 this.props.navigation.goBack();
	  }
	_onParticipantAddedVideoTrack = (data) => {
	    // call everytime a participant joins the same room
		 let track = data.track;
		 let participant = data.participant;
		 participant['videoTrackSid'] = track.trackSid;
		 participant['participantSid'] = participant.sid;

		 let videoTracksArray = this.state.videoTracksArray;
		 videoTracksArray.push(data);
		 this.setState({ videoTracksArray }, () => {
			 console.log(this.state);
		 });
		 this.toast.show(`Participant joined the room`, 1000, () => {
 			// something you want to do at close
 	  	});
	  }

	_onParticipantRemovedVideoTrack = (data) => {
	    // gets called when a participant disconnects.
		 let participant = data.participant;
		 let track = data.track;

		 // push this
		 this.toast.show(`Participant left the room`, 1000, () => {
 			// something you want to do at close
 	  	});
	   console.log("onParticipantRemovedVideoTrack: ", participant, track)
		const videoTracks = this.state.videoTracks;
		const videoTracksArray = this.state.videoTracksArray.concat();

		let indexOfFound = videoTracksArray.findIndex(function(a){
			return a.participant.identity == participant.identity;
		});
		if(indexOfFound != -1) {
			videoTracksArray.splice(indexOfFound, 1);
			this.setState({ videoTracksArray: videoTracksArray }, ()=>{
				console.log('state after remove video', this.state);
			})
		}

	  }


	render() {
		 	const windowWidth = Dimensions.get('window').width;
		 	const windowHeight = Dimensions.get('window').height;

			const getRandomInt = (max) => {
			  return Math.floor(Math.random() * max);
			}

			// const participants = Array.from(this.state.videoTracks)
			// const _participants = [];
			// if(this.state.videoTracks) {
			// 	Array.from(this.state.videoTracks, ([trackSid, trackIdentifier, identity]) => {
			// 		_participants.push({
			// 			trackSid,
			// 			trackIdentifier,
			// 			identity: trackIdentifier.identity });
			// 	});
			// }

				const attendees = this.state.attendees.concat().map((currentVal) => {
					var participant = this.state.videoTracksArray.find((p)=>{
						if (p.participant.identity) {
							if(p.participant.identity.split('::')[1] == currentVal.userId) {
								return true;
							}
						}
					})
					if (participant) {
						currentVal["twilio"] = participant; // find out why even though there a twilio track no video being showed
					}
					else {
						currentVal["twilio"] = null;
					}
					return currentVal;
				});

				console.log('1===============================');
				console.log('attendees', attendees);
				console.log('videoTracksArray', this.state.videoTracksArray);
				console.log('2===============================');

				const Item = ({attendee}) => {
					let _color = attendee.color.replace('#', '');
					let size = windowWidth - 80;
					return (<View style={[styles.grid2, { backgroundColor: "#"+_color, width: size, height: size }]}>
							{attendee.twilio ? (<TwilioVideoParticipantView
							  style={[styles.remoteVideo, { width: size, height: size }]}
							  key={attendee.twilio.track.trackSid}
							  trackIdentifier={attendee.twilio.participant}
							/>) : (<Image
									style={{height: 64, width: 64}}
									source={{uri: `https://ui-avatars.com/api/?name=${attendee.name}&format=png&color=fff&background=${_color}`}}
									/>)}

						<TouchableOpacity style={{position: 'absolute', top: 10, right: 10}}>
							<Image source={ICON_MICROPHONE_ORANGE} style={{width: 30, height: 30}} />
						</TouchableOpacity>

						<Image source={ICON_CROWN_ORANGE} style={{position: 'absolute', left:10, bottom: 12, width: 15, height: 15}} />
						<Text style={{position: 'absolute', bottom: 10, left: 30, color: '#fff'}}>{attendee.name}</Text>
					</View>);
				}

				const ItemThumbnail = ({attendee }) => {
					let _color = attendee.color.replace('#', '');
					let size = (windowWidth/2) - 48;
					return (<View style={[styles.grid2, { backgroundColor: "#"+_color, width: size, height: size, marginHorizontal: 4 }]}>
							{attendee.twilio ? (<TwilioVideoParticipantView
							  style={[styles.remoteVideo, { width: size, height: size }]}
							  key={attendee.twilio.track.trackSid}
							  trackIdentifier={attendee.twilio.participant}
							/>) : (<Image
									style={{height: 64, width: 64}}
									source={{uri: `https://ui-avatars.com/api/?name=${attendee.name}&format=png&color=fff&background=${_color}`}}
									/>)}

						<TouchableOpacity style={{position: 'absolute', top: 10, right: 10}}>
							<Image source={ICON_MICROPHONE_ORANGE} style={{width: 30, height: 30}} />
						</TouchableOpacity>

						<Image source={ICON_CROWN_ORANGE} style={{position: 'absolute', left:10, bottom: 12, width: 15, height: 15}} />
						<Text style={{position: 'absolute', bottom: 10, left: 30, color: '#fff'}}>{attendee.name}</Text>
					</View>);
				}

				const renderItem = ({ item }) => {
					if(this.state.layout == LAYOUT_GRID_1_COLUMN) {
						return (<Item
							attendee={item}
							key={item.userId}/>);
					}
					else {
						return (<ItemThumbnail
							attendee={item}
							key={item.userId} />);
					}
				};

				// {this.state.status === 'disconnected' ? <Text>Disconnected</Text>: null}
				// {this.state.status === 'connecting' ? <Text>connecting</Text> : null}
			const myColor = (this.state.currentUser) && (this.state.currentUser.color) ? this.state.currentUser.color : colors[getRandomInt(colors.length)].replace('#','');
			return (
				<View style={{ flex: 1, marginTop: 30, backgroundColor: '#FFF', padding: 20, paddingTop: 80 }}>
					<NavBarMeeting>
							<TouchableOpacity style={{position: 'absolute', top: 10, left: 20}} onPress={()=> {}}>
								<View style={{height:50,width:50, borderRadius: 25, overflow: 'hidden', alignItems:'center', justifyContent:'center'}}>
									<Image style={{height: 44, width: 44}} source={ICON_MENU}/>
								</View>
							</TouchableOpacity>
							<TouchableOpacity style={{position: 'absolute', top: 10, right: 20}} onPress={()=>{}}>
								<View style={{ height:44,width:44, borderRadius: 22, overflow: 'hidden', alignItems:'center', justifyContent:'center'}}>
									<Image style={{height: 50, width: 50}} source={{uri: `https://ui-avatars.com/api/?name=${this.state.name}&format=png&color=fff&background=${myColor}`}}/>
								</View>
							</TouchableOpacity>
					</NavBarMeeting>

					{ this.state.layout == LAYOUT_GRID_1_COLUMN ? (<FlatList
							key={'col1'}
							data={attendees}
							renderItem={renderItem}
							keyExtractor={item => "col1"+item.id}
							style={{backgroundColor: '#F2F4F6', padding: 20, borderRadius: 8, marginBottom: 100}}
							contentContainerStyle={{paddingBottom: 40}}
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
						 />) : (<FlatList
							 	key={'col2'}
	 							data={attendees}
								numColumns={2}
	 							renderItem={renderItem}
	 							keyExtractor={item => "col2"+item.id}
	 							style={{backgroundColor: '#F2F4F6', padding: 20, borderRadius: 8, marginBottom: 100}}
	 							contentContainerStyle={{paddingBottom: 40}}
	 							showsHorizontalScrollIndicator={false}
	 							showsVerticalScrollIndicator={false}
	 						 />)}

						 {
 	 					  this.state.status === 'connected' &&
 	 					  <View style={styles.remoteGrid}>
 	 						 <TwilioVideoLocalView
 	 							enabled={true}
 	 							style = {this.state.isButtonDisplay ? styles.localVideoOnButtonEnabled : styles.localVideoOnButtonDisabled}
 	 						 />
 	 					  </View>
 	 					}

					 			 <View style={styles.actionToolbar}>
					 				 <TouchableOpacity onPress={()=> {this._onMuteButtonPress() }}>
					 				 	<View style={[styles.roundButtons, { backgroundColor: this.state.isAudioEnabled ? '#FF3C3C' : '#363B45'} ]}>
					 						<Image source={ICON_MICROPHONE_OFF} style={styles.actionIcon} />
					 					</View>
					 				 </TouchableOpacity>
					 				 <TouchableOpacity onPress={()=> {this._onDisableVideoButtonPress() }}>
					 				  <View style={[styles.roundButtons, { backgroundColor: this.state.isVideoEnabled ? '#FF3C3C' : '#363B45'} ]}>
					 					  <Image source={ICON_VIDEO} style={styles.actionIcon} />
					 				  </View>
					 			   </TouchableOpacity>
					 				<TouchableOpacity onPress={()=> {this._onEndButtonPress() }}>
					 				  <View style={[styles.roundButtons, {backgroundColor: '#FF3C3C'}]}>
					 					  <Image source={ICON_PHONE} style={styles.actionIcon} />
					 				  </View>
					 				</TouchableOpacity>
					 				<TouchableOpacity onPress={()=> { this._onFlipButtonPress() }}>
										  <View style={[styles.roundButtons, { backgroundColor: !this.state.isCameraFliped ? '#363B45' : '#F69017'} ]}>
					 					  <Image source={ICON_SCREENSHARE} style={styles.actionIcon} />
					 				  </View>
					 				</TouchableOpacity>

					 				<Menu>
							 		   <MenuTrigger>
						 					<View style={styles.roundButtons}>
						 						<Image source={ICON_MORE} style={styles.actionIcon} />
						 					</View>
							 			</MenuTrigger>
						 		      <MenuOptions optionsContainerStyle={{backgroundColor:'#fff', padding: 10, borderRadius: 8}}>
						 		         {/*<MenuOption onSelect={() => null} ><Text style={{padding: 4}}>Ask for host access</Text></MenuOption>
						 		         <MenuOption onSelect={() => null} ><Text style={{padding: 4}}>Settings</Text></MenuOption>
						 				   <MenuOption onSelect={() => null} ><Text style={{padding: 4}}>Background</Text></MenuOption>*/}
											<MenuOption onSelect={() => {
													this.switchLayout();
												}} ><Text style={{padding: 4}}>Change layout</Text></MenuOption>
						 		      </MenuOptions>
					 		    	</Menu>
					 			 </View>


					<Toast ref={(toast) => this.toast = toast}/>
					<TwilioVideo
				          ref="twilioVideo"
				          onRoomDidConnect={ this._onRoomDidConnect }
				          onRoomDidDisconnect={ this._onRoomDidDisconnect }
				          onRoomDidFailToConnect= { this._onRoomDidFailToConnect }
				          onParticipantAddedVideoTrack={ this._onParticipantAddedVideoTrack }
				          onParticipantRemovedVideoTrack= { this._onParticipantRemovedVideoTrack }
				        />
				</View>
			);
	}
}


const styles = StyleSheet.create({
  grid2: {
    height: 200,
	 width: 200,
	 alignItems: 'center',
	 justifyContent: 'center',
	 borderRadius: 8,
	 overflow:'hidden',
	 marginBottom: 10,
  },
  actionToolbar: {
	 flexDirection: 'row',
	 justifyContent: 'center',
	 position: 'absolute',
	 backgroundColor: '#fff',
	 bottom: 0,
	 right: 0,
	 left: 0,
	 height: 120,

  },
  roundButtons: {
	  backgroundColor: '#363B45',
	  width: 60,
	  height: 60,
	  borderRadius: 30,
	  margin: 6,
	  alignItems: 'center',
	  justifyContent: 'center',
  },
  actionIcon: {
	  width: 20,
	  height: 20,
	  resizeMode: 'cover'
  },


  callContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    minHeight:"100%"
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white'
  },
  button: {
    marginTop: 100
  },
  localVideoOnButtonEnabled: {
    bottom: ("40%"),
    width: "35%",
    left: "64%",
    height: "25%",
    zIndex: 2,
  },
  localVideoOnButtonDisabled: {
    bottom: ("30%"),
    width: "35%",
    left: "64%",
    height: "25%",
    zIndex: 2,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: "column",
  },
  remoteVideo: {
    width: 200,
    height: 200,
    zIndex: 1,
  },
  optionsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 2,
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: "center"
  },
  spacing: {
    padding: 10
  },
  inputLabel: {
    fontSize: 18
  },
  buttonContainer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 90,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#1E3378",
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 10
  },
  Buttontext: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18
  },
  inputBox: {
    borderBottomColor: '#cccccc',
    fontSize: 16,
    width: 300,
    borderBottomWidth:1
  },
});
