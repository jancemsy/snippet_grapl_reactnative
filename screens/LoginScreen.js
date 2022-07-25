import React, { useState } from "react";
import { ActivityIndicator, View, Text, StatusBar, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { getUser, login } from "../api/controller";
import UserService from "../services/UserService";
import CustomModal from "../components/CustomModal";
import { ThemingStyles } from "./Styles";
import showpassImg from '../assets/images/icons/showpass.png'
import hidepassImg from '../assets/images/icons/hidepass.png'
import notificationStore, {STATES} from '../stores/notificationStore';

export default function LoginScreen({ navigation }) {

	const [email, setemail] = useState('test@test.com')
	const [pass, setPass] = useState('Demo123!')
	const [modalShow, setModalShow] = useState(false)
	const [modalInfo, setModalInfo] = useState('')
	const [showpass, setShowPass] = useState(false)
	const [wait, setWait] = useState(false)
	const [loginSuccess, setloginSuccess] = useState(false)
	const [userImg, setuserImg] = useState('')

	StatusBar.setBarStyle('light-content', true);

	const handleLogin = async () => {
		setWait(true)

		const userInfo = await login({ "email": `${email}`, "password": `${pass}` })
		setTimeout(() => {
			setWait(false)
		}, 300);

		switch (userInfo.msg) {
			case 'Authorized logged in.':
				const user = await getUser(userInfo.token)
				setModalInfo(`${user.info.username}`)
				setuserImg(`${user.info.avatar_url}`)
				setloginSuccess(true)
				await UserService.setUserData({
					id : user.info._id,
					email: email,
					name: user.info.username,
					token: userInfo.token,
					avatar_url: user.info.avatar_url
				})

                notificationStore.dispatch({ type : STATES.CONNECT_CHAT,  payload : null   }); 
				navigation.navigate('RoomScreen'); 				
				break;
			case 'Authentication failed. Wrong password.':
				setModalInfo('Wrong password.')
				setloginSuccess(false)
				setModalShow(true)
				break;
			case 'Authentication failed. User not found.':
				setModalInfo('User not found.')
				setloginSuccess(false)
				setModalShow(true)
				break;

			default:
				break;
		}

	};


	const handleNavigateCreateAccount = () => {
		navigation.navigate('SignUpScreen');
	};


	const handleNavigateForgot = () => {
		navigation.navigate('ForgotPasswordScreen');
	};

	const handleNavigateBack = () => {
		navigation.goBack();
	}

	return (
		<ScrollView>


			<View style={{ flex: 1, alignItems: 'center', height: Dimensions.get('window').height }}>

				<LinearGradient
					// Background Linear Gradient
					colors={['#00205B', '#0659A9']}
					style={styles.background}
				/>
				<Image style={{ height: 58, width: 200, marginTop: '40%', marginBottom: '40%' }} source={require('../assets/images/grapl-white-logo.png')} />

				<View style={styles.textInputCont}>
					<TextInput
						selectionColor={'rgb(246, 144, 24)'}
						style={styles.input}
						autoCapitalize="none"
						autoComplete={false}
						value={email}
						placeholder="Email Address"
						onChangeText={text => setemail(text)}
					/>
					<Image style={styles.mail} source={require('../assets/images/icons/mail.png')} />
				</View>

				<View style={styles.textInputCont}>
					<TextInput
						selectionColor={'rgb(246, 144, 24)'}
						autoComplete='password'
						secureTextEntry={!showpass}
						style={styles.input}
						value={pass}
						placeholder="Password"
						onChangeText={text => setPass(text)}
					/>
					<Image style={styles.key} source={require('../assets/images/icons/key.png')} />
					<TouchableOpacity style={{ height: 45, width: 50, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 5 }} onPress={() => setShowPass(!showpass)}>
						{pass.length !== 0 &&
							<Image style={styles.pass} source={showpass ? showpassImg : hidepassImg} />
						}
					</TouchableOpacity>
				</View>



				<TouchableOpacity disabled={email.length === 0 || pass.length < 3} onPress={handleLogin}>
					<View style={{
						margin: 5,
						backgroundColor: `${email.length === 0 || pass.length < 3 ? 'rgba(246,144,24,.9)' : 'rgb(246,144,24)'}`,
						padding: 10,
						height: 45,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: 20, width: 250
					}}>

						{wait ? <ActivityIndicator size="small" color="#fff" /> :
							<Text style={{ color: `${email.length === 0 || pass.length < 3 ? 'rgba(255,255,255,.6)' : 'rgb(255,255,255)'}`, fontSize: 15 }}>Login</Text>
						}
					</View>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => navigation.navigate('MagicLinkScreen')}>
					<View style={{
						margin: 5,
						backgroundColor: 'rgb(59,59,59)',
						padding: 10,
						height: 45,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: 20, width: 250
					}}>


						<Text style={{ color: 'rgb(255,255,255)', fontSize: 15 }}>Sign in with Magic Link</Text>

					</View>
				</TouchableOpacity>

				<TouchableOpacity onPress={handleNavigateForgot}>
					<View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: '#fff', fontSize: 15 }}>Forgot Password?</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity onPress={handleNavigateBack}>
					<View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: '#fff', fontSize: 15 }}>Cancel</Text>
					</View>
				</TouchableOpacity>


				<View style={{ position: 'absolute', bottom: 20, display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
					<TouchableOpacity onPress={handleNavigateCreateAccount}>
						<View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ color: '#fff', fontSize: 15 }}>Create an Account</Text>
						</View>
					</TouchableOpacity>

				</View>

				{modalShow &&
					<CustomModal show={modalShow}>
						<Text style={ThemingStyles.modalTitle}>{loginSuccess ? 'Welcome' : 'Login Failed'}</Text>
						{loginSuccess && <Image style={{ height: 50, width: 50, borderRadius: 999, marginBottom: 10 }} source={{ uri: userImg }} />}

						<Text style={ThemingStyles.modalText}>{modalInfo}</Text>
						<TouchableOpacity onPress={() => setModalShow(false)}>
							<View style={ThemingStyles.orangeButton} >
								<Text style={ThemingStyles.orangeButtonText}>OK</Text>
							</View>
						</TouchableOpacity>
					</CustomModal>
				}

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
	mail: {
		width: 16,
		height: 16,
		position: 'absolute',
		marginLeft: 20
	},
	key: {
		width: 17,
		height: 17,
		position: 'absolute',
		marginLeft: 20
	},
	pass: {
		opacity: .8,
		width: 18,
		height: 11,
	}
});
