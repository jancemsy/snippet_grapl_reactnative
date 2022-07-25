import React, { useState } from "react";
import { View, Text, StatusBar, Image, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import { ThemingStyles } from "./Styles";
import { signup } from "../api/controller";

export default function SignUpScreen({ navigation }) {

	const [name, setname] = useState('')
	const [mail, setmail] = useState('')
	const [pass, setpass] = useState('')
	const [passConfirm, setpassConfirm] = useState('')
	const [wait, setWait] = useState(false)

	const [eight, seteight] = useState(false)
	const [number, setnumber] = useState(false)
	const [upper, setupper] = useState(false)
	const [lower, setlower] = useState(false)
	const [special, setspecial] = useState(false)

	const [match, setmatch] = useState(false)
	const [evalid, setevalid] = useState(false)


	StatusBar.setBarStyle('light-content', true);

	const buttonCheck = () => {
		return (name.length !== 0 && mail.length !== 0 && !match && !eight && !number && !upper && !lower && !special && !evalid)
	}

	const handleNavigateLogin = () => {
		navigation.navigate('LoginScreen');
	};

	const validateEmail = (email) => {
		if (email.length > 0) {
			setevalid(true)
			if (String(email)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				)) setevalid(false)
		} else {
			setevalid(false)
		}

		setmail(email)

	};

	const handleSignUp = async () => {
		// navigation.navigate('SignUpComplete');
		const data = {
			username: `${name}`,
			email: `${mail}`,
			account: {
				password: `${pass}`
			}
		}

		setWait(true)
		const response = await signup(data)
		setTimeout(() => {
			setWait(false)
		}, 300);

		console.log(response.msg);

		switch (response.msg) {
			case 'Please verify email':

				break;
			case 'This email is already in use':
				navigation.navigate('SignUpComplete', { name: `${name}`, email: `${mail}` });
				break;

			default:
				break;
		}
	};


	const handlePass = (pass) => {
		if (pass.length > 0) {
			var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

			seteight(true)
			setnumber(true)
			setupper(true)
			setlower(true)
			setspecial(true)
			if (/\d/.test(pass)) setnumber(false)
			if (format.test(pass)) setspecial(false)
			if (pass.length > 7) seteight(false)
			if (/[a-z]/.test(pass)) setupper(false)
			if (/[A-Z]/.test(pass)) setlower(false)
			if (pass === passConfirm) {
				setmatch(false)
			} else {
				setmatch(true)
			}
		} else {
			seteight(false)
			setnumber(false)
			setupper(false)
			setlower(false)
			setspecial(false)
		}
		setpass(pass)
	}

	const handleMatch = (password) => {
		if (password.length > 0) {
			setmatch(true)
			if (pass === password) setmatch(false)

		} else {
			setmatch(false)
		}
		setpassConfirm(password)
	}

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
				<Image style={{ height: 58, width: 200, marginTop: '40%', marginBottom: '30%' }} source={require('../assets/images/grapl-white-logo.png')} />

				<View style={styles.textInputCont}>
					<TextInput
						style={styles.input}
						placeholder="Full Name"
						onChangeText={(text) => setname(text)}
					/>
					<Image style={styles.mail} source={require('../assets/images/icons/user.png')} />
				</View>

				<View style={styles.textInputCont}>
					<TextInput
						style={styles.input}
						autoCapitalize="none"
						autoComplete={false}
						placeholder="Email Address"
						onChangeText={(text) => validateEmail(text)}
					/>
					<Image style={styles.key} source={require('../assets/images/icons/mail.png')} />
				</View>

				{
					evalid &&
					<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Image style={{ width: 15, height: 15, marginTop: 1, marginRight: 2 }} source={require('../assets/images/icons/error.png')} />
						<Text style={{ color: '#ff3b3b', fontSize: 13 }}>Invalid email address</Text>
					</View>
				}

				<View style={styles.textInputCont}>
					<TextInput
						style={styles.input}
						placeholder="Password"
						onChangeText={(text) => handlePass(text)}
					/>
					<Image style={styles.key} source={require('../assets/images/icons/key.png')} />
				</View>

				<View style={[styles.textInputCont, {}]}>
					{
						eight &&
						<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<Image style={{ width: 15, height: 15, marginTop: 1, marginRight: 2 }} source={require('../assets/images/icons/error.png')} />
							<Text style={{ color: '#ff3b3b', fontSize: 13 }}>Must be atleast 8 characters</Text>
						</View>
					}
					{
						number &&
						<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<Image style={{ width: 15, height: 15, marginTop: 1, marginRight: 2 }} source={require('../assets/images/icons/error.png')} />
							<Text style={{ color: '#ff3b3b', fontSize: 13 }}>Must contain atleast 1 number</Text>
						</View>
					}
					{
						lower &&
						<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<Image style={{ width: 15, height: 15, marginTop: 1, marginRight: 2 }} source={require('../assets/images/icons/error.png')} />
							<Text style={{ color: '#ff3b3b', fontSize: 13 }}>Must contain atleast 1 upper case</Text>
						</View>
					}
					{
						upper &&
						<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<Image style={{ width: 15, height: 15, marginTop: 1, marginRight: 2 }} source={require('../assets/images/icons/error.png')} />
							<Text style={{ color: '#ff3b3b', fontSize: 13 }}>Must contain atleast 1 lower case</Text>
						</View>
					}
					{
						special &&
						<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<Image style={{ width: 15, height: 15, marginTop: 1, marginRight: 2 }} source={require('../assets/images/icons/error.png')} />
							<Text style={{ color: '#ff3b3b', fontSize: 13 }}>Must contain atleast 1 special character</Text>
						</View>
					}
				</View>


				<View style={styles.textInputCont}>
					<TextInput
						style={styles.input}
						placeholder="Confirm Password"
						onChangeText={(text) => handleMatch(text)}
					/>
					{/* <Image style={styles.mail} source={require('../assets/images/icons/phone.png')} /> */}
					<Image style={styles.key} source={require('../assets/images/icons/key.png')} />
				</View>

				{
					match &&
					<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Image style={{ width: 15, height: 15, marginTop: 1, marginRight: 2 }} source={require('../assets/images/icons/error.png')} />
						<Text style={{ color: '#ff3b3b', fontSize: 13 }}>Password did not match</Text>
					</View>
				}

				<TouchableOpacity onPress={handleSignUp} disabled={!buttonCheck()} >
					<View style={[ThemingStyles.orangeButton, { width: 250, marginTop: 5 }]}>
						{wait ? <ActivityIndicator size="small" color="#fff" /> :
							<Text style={{ color: `${!buttonCheck() ? 'rgba(255,255,255,.6)' : 'rgb(255,255,255)'}`, fontSize: 15 }}>Sign Up</Text>
						}
					</View>
				</TouchableOpacity>

				<TouchableOpacity onPress={handleNavigateBack}>
					<View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: '#fff', fontSize: 15 }}>Cancel</Text>
					</View>
				</TouchableOpacity>


				<View style={{ position: 'absolute', bottom: 20, display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
					<TouchableOpacity onPress={handleNavigateLogin}>
						<View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ color: '#fff', fontSize: 15 }}>Already have an Account</Text>
						</View>
					</TouchableOpacity>

				</View>



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
	}
});
