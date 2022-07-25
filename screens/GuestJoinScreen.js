import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, StatusBar, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { guestJoin, getMe, getTwilioToken } from "../api/controller";
import { ThemingStyles } from "./Styles";
import CustomModal from "../components/CustomModal";
const graplWS = require('../api/ws.js');
var roomName = 'http://localhost:1234/61cac0c94669413e08ade1d5';
import UserService from "../services/UserService";

export default function GuestJoinScreen({ navigation }) {

	StatusBar.setBarStyle('dark-content', true);
	const [room, setRoom] = useState(roomName)
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [wait, setWait] = useState(false)
	const [showModal, setshowModal] = useState(false)
	const [modalInfo, setmodalInfo] = useState('')

	useEffect(()=>{
		setRoom(roomName);
	}, []);

	const handleRoom = (room) => { 
		var newRoom = room;  
		if( room.search('/') > -1 ){
			var arr = room.split('/'); 
			newRoom = arr[ arr.length - 1]; 
		}   
		setRoom(newRoom); 
	}

	const handleNavigateJoin = async () => {  
		setWait(true) 
		const params = new URLSearchParams()
		params.append('username', `${name}`)
		params.append('meetingName', `${room}`)
		params.append('email', `${email}`)

		const { token } = await guestJoin(params)
		let userDataResponse = await getMe(token.token);
		if(token.token){
				await UserService.setUserData({
					id : userDataResponse._id,
					email, 
					name,  
					token: token.token,
					avatar_url: ''
				})
			}

		const socketConnection = graplWS.connect(room, token.token, async (socketConnectionId) => { 
			const identity = `${roomName}::${userDataResponse._id}::${socketConnection.id}`;

			console.log(identity);
			const response = await getTwilioToken(identity);
			navigation.navigate('Meeting', {
				roomName: roomName,
				token: response.accessToken,
				identity: identity,
				email: email,
				name: name
			});
			setWait(false)
		});

		//setmodalInfo(token.token)
		//setshowModal(true)
	};


	const handleNavigateHaveAccount = () => {
		navigation.navigate('LoginScreen');
	};

	const handleNavigateBack = () => {
		navigation.goBack();
	}

	return (


		<ScrollView style={styles.ScrollView}>
			<StatusBar hidden={true} translucent={true} />
			<View style={{ height: Dimensions.get('window').height, alignItems: 'center' }}>

				<LinearGradient
					// Background Linear Gradient
					colors={['#00205B', '#0659A9']}
					style={styles.background}
				/>
				<Image style={{ height: 58, width: 200, marginTop: '40%', marginBottom: '30%' }} source={require('../assets/images/grapl-white-logo.png')} />

				<View style={styles.textInputCont}>
					<TextInput
						style={styles.input}
						placeholder="Room ID"
						value={room}
						onChangeText={text => handleRoom(text)}
					/>
					<Image style={styles.room} source={require('../assets/images/icons/room.png')} />
				</View>

				<View style={styles.textInputCont}>
					<TextInput
						style={styles.input}
						autoCapitalize="none"
						autoComplete={false}
						placeholder="Email Address"
						onChangeText={text => setEmail(text)}
					/>
					<Image style={styles.mail} source={require('../assets/images/icons/mail.png')} />
				</View>

				<View style={styles.textInputCont}>
					<TextInput
						style={styles.input}
						placeholder="Name"
						onChangeText={text => setName(text)}
					/>
					<Image style={styles.user} source={require('../assets/images/icons/user.png')} />
				</View>


				<TouchableOpacity onPress={handleNavigateJoin} disabled={email.length === 0 || name.length === 0 || room.length === 0}>
					<View style={[ThemingStyles.orangeButton, { width: 250, marginTop: 5 }]}>
						{/* <Text style={{ color: '#fff', fontSize: 15 }}>Join as Guest</Text> */}
						{wait ? <ActivityIndicator size="small" color="#fff" /> :
							<Text style={{ color: `${email.length === 0 || name.length === 0 || room.length === 0 ? 'rgba(255,255,255,.6)' : 'rgb(255,255,255)'}`, fontSize: 15 }}>Join as Guest</Text>
						}
					</View>
				</TouchableOpacity>

				<TouchableOpacity onPress={handleNavigateBack}>
					<View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: '#fff', fontSize: 15 }}>Cancel</Text>
					</View>
				</TouchableOpacity>

				<View style={{ position: 'absolute', bottom: 20, display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
					<TouchableOpacity onPress={handleNavigateHaveAccount}>
						<View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ color: '#fff', fontSize: 15 }}>Already have an Account</Text>
						</View>
					</TouchableOpacity>

				</View>
				{showModal && <CustomModal show={showModal}>
						<Text style={ThemingStyles.modalTitle}>Guest Join</Text>
						<Text style={ThemingStyles.modalText}>{modalInfo}</Text>
						<TouchableOpacity onPress={() => setshowModal(false)}>
							<View style={ThemingStyles.orangeButton} >
								<Text style={ThemingStyles.orangeButtonText}>OK</Text>
							</View>
						</TouchableOpacity>
				</CustomModal>}


			</View>
		</ScrollView>
	);
}


const styles = StyleSheet.create({
	input: {
		height: 45,
		margin: 5,
		borderRadius: 99,
		borderWidth: 0,
		backgroundColor: '#fff',
		padding: 10,

		width: 250,
		paddingLeft: 42
	},
	imgBG: {
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		position: 'absolute',
		bottom: -100
	},
	background: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: '100%',
	},
	textInputCont: {
		justifyContent: 'center',
	},
	room: {
		width: 17,
		height: 17,
		position: 'absolute',
		marginLeft: 20
	},
	mail: {
		width: 16,
		height: 16,
		position: 'absolute',
		marginLeft: 20
	},
	user: {
		width: 16,
		height: 16,
		position: 'absolute',
		marginLeft: 20
	},
	ScrollView: {
	}
});
